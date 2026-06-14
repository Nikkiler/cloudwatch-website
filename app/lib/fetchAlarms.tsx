import {
  CloudWatchClient,
  DescribeAlarmsCommand,
  type MetricAlarm, 
} from "@aws-sdk/client-cloudwatch";
import type { CloudWatchClientConfig } from "@aws-sdk/client-cloudwatch";
import { fromIni } from "@aws-sdk/credential-providers";
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

  const alarms = results.flatMap((result) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }

    console.error('Failed to fetch alarms for one AWS profile:', result.reason);
    return [];
  });

  const validAlarms = alarms.filter(
    (alarm): alarm is MetricAlarm => Boolean(alarm && alarm.AlarmName)
  );

  await syncAlarmsWithCloudwatch(validAlarms);

  return validAlarms;
}

async function syncAlarmsWithCloudwatch(alarms: MetricAlarm[]) {
  const rows = alarms
    .filter((alarm) => alarm.AlarmName != null)
    .map((alarm) => ({
      name: String(alarm.AlarmName),
      display_status: true,
    }));

  for (const row of rows) {
    await sql`
      INSERT INTO alarms (name, display_status)
      VALUES (${row.name}, ${row.display_status})
      ON CONFLICT (name)
      DO NOTHING
    `;
  }

  return rows;
}