import Link from "next/link";
import AlarmGrid from "../components/AlarmGrid";
import getCloudWatchAlarms from '../lib/fetchAlarms';
import SaveButton from '../components/SaveButton';
import BackButton from '../components/BackButton';
export default async function Page() {
  const alarms = await getCloudWatchAlarms();
  return (
    <main className="min-h-screen bg-panel p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Admin – Alarm Display
            </h1>
            <p className="text-sm text-mutedText mt-1">
              Toggle which alarms should be visible.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <BackButton/>
            <SaveButton/>
          </div>
        </header>
        <AlarmGrid alarms={alarms} isAdmin />
      </div>
    </main>
  );
}