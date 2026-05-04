import {
  CloudWatchClient,
  DescribeAlarmsCommand,
  type MetricAlarm, 
} from "@aws-sdk/client-cloudwatch";
import type { CloudWatchClientConfig } from "@aws-sdk/client-cloudwatch";
import { fromIni } from "@aws-sdk/credential-providers"; // ES6 import
import fs from "fs";
import path from "path";
import os from "os";
import ini from "ini";
import sql from '@/app/sql/db';

function loadAwsProfiles() {
  const credentialsPath = path.join(os.homedir(), ".aws", "credentials");

  if (!fs.existsSync  (credentialsPath)) {
    return [];
  }

  const parsed = ini.parse(fs.readFileSync(credentialsPath, "utf-8"));
  return Object.keys(parsed);
}
async function getMetricAlarmsForProfile(profile) {
  const client = new CloudWatchClient({
    credentials: fromIni({ profile }),
    region: process.env.AWS_REGION ?? "ap-southeast-2",
  });

  const alarms: MetricAlarm[] = [];
  let NextToken: string | undefined;

  do {
    const response = await client.send(
      new DescribeAlarmsCommand({ NextToken })
    );

    if (response.MetricAlarms) {
      alarms.push(...response.MetricAlarms);
    }

    NextToken = response.NextToken;
  } while (NextToken);

  return alarms;
}
export default async function getCloudWatchAlarms() {
  const profiles = loadAwsProfiles();

  const results = await Promise.allSettled(
    profiles.map(profile => getMetricAlarmsForProfile(profile))
  );
  syncAlarmsWithCloudwatch(results.flatMap(r => r.value));
  return await results.flatMap(r => r.value);
}

async function syncAlarmsWithCloudwatch(alarms) {
  const checks = await sql<{ name: string, display_Status: boolean}[]>`
    SELECT name, display_Status FROM alarms
  `;
  const previousVisibility: Record<string, boolean> = {};
  for (const check of checks) {
    previousVisibility[check.name] = check.display_Status;
  }
  await sql `TRUNCATE TABLE alarms`;
  const rows = alarms
    .filter((alarm) => alarm.AlarmName != null)
    .map((alarm) => {
      const name = String(alarm.AlarmName);

      const visibility =
        previousVisibility[name] !== undefined
        ? previousVisibility[name]
        : true;
      return {name, display_status: visibility,};
    });
  for (const row of rows) {
    await sql`
      INSERT INTO alarms (name, display_status)
      VALUES (${row.name}, ${row.display_status})
    `;
  }
  return rows;

}