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

  return results.flatMap(r => r.value);
}

async function checkAgainstDB(alarms) {
  try {
    const rows = alarms
        .filter((alarm) => alarm.AlarmName != null)
        .map((alarm) => ({
        name: String(alarm.AlarmName),
        display_status: true as boolean
      }));
    i = 0;
    for (const row of rows) {
      await sql`
        SELECT name, display_Status FROM alarms
      `;
      i++;
    }
  } catch (error) {
    console.error("Failed", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}
