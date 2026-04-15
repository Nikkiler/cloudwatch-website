import Link from "next/link";
import getCloudWatchAlarms from './lib/fetchAlarms';
import AlarmGrid from "./components/AlarmGrid";
import sql from "./sql/db";

export default async function Home() {
  const alarms = await getCloudWatchAlarms();
  const test = await sql`SELECT * FROM alarms`;
  console.log(test);

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
        <AlarmGrid alarms={alarms} />
      </div>
    </main>
  );
}