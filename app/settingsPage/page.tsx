import Link from "next/link";
import AdminAlarmGrid from "../components/AdminAlarmGrid";
import getCloudWatchAlarms from '../lib/fetchAlarms';
import SaveButton from '../components/SaveButton';
import BackButton from '../components/BackButton';
import sql from "../sql/db";
export default async function Page() {
  const alarms = await getCloudWatchAlarms();
  const adminVisibilityRows = await sql <{ name: String, display_status: boolean}[]> `
    SELECT name, display_Status FROM alarms
  `;
  const adminVisibilityByName: Record<string, boolean> = {};
  for (const row of adminVisibilityRows) {
    adminVisibilityByName[row.name] = row.display_status;
  }
  const adminVisibleAlarms = alarms.map((alarm) => {
    const name = alarm.AlarmName ? String(alarm.AlarmName) : "Not found";

    const display_status = adminVisibilityByName[name] ? adminVisibilityByName[name] : true;

    return {alarm, display_status};
  });
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
        <AdminAlarmGrid initialAlarms={adminVisibleAlarms} isAdmin />
      </div>
    </main>
  );
}