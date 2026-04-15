import sql from '@/app/sql/db';
import getCloudwatchAlarms from '@/app/lib/fetchAlarms';
import {
  CloudWatchClient,
  DescribeAlarmsCommand,
  type MetricAlarm,
} from "@aws-sdk/client-cloudwatch";

async function seedAlarms() {
	try {

		const alarms = await getCloudwatchAlarms();

		const rows = alarms
  			.filter((alarm) => alarm.AlarmName != null)
  			.map((alarm) => ({
    		name: String(alarm.AlarmName),
    		display_status: true as boolean
  		}));
		for (const row of rows) {
			await sql`
				INSERT INTO alarms (name, display_status)
				VALUES (${row.name}, ${row.display_status})
			`;
		}
	} catch (error) {
		console.error("Failed", error);
		process.exit(1);
	} finally {
		await sql.end();
	}
}

seedAlarms();