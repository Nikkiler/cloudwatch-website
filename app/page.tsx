import Link from "next/link";
import getCloudWatchAlarms from './lib/fetchAlarms';
import ClientAlarmGrid from "./components/ClientAlarmGrid";
import sql from "./sql/db";
import type { MetricAlarm } from "@aws-sdk/client-cloudwatch";
export default async function Home() {
  const alarms = await getCloudWatchAlarms();
  const visibilityRows = await sql<{ name: String; display_status: boolean }[]>`
    SELECT name, display_Status FROM alarms
  `;
  const visibilityByName: Record<string, boolean> = {};
  for (const row of visibilityRows) {
    visibilityByName[row.name] = row.display_status;
  }
  const visibleAlarms = alarms.filter((alarm) => {
    const name = alarm.AlarmName;

    if (!name) {
      const name = "Name not found";
      return true;
    }

    const visibility = visibilityByName[name];
    return visibility !== false;
  });
  return (
    <main className="min-h-screen bg-panel p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">
            CloudWatch Alarms
          </h1>
          <Link
          href="/settingsPage"
          className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 text-white hover:bg-slate-700"
          >
          Settings
          </Link>
        </header>
        <ClientAlarmGrid alarms={visibleAlarms} />
      </div>
    </main>
  );
}