import Link from "next/link";
import getCloudWatchAlarms from '../lib/fetchAlarms';
import SaveButton from '../components/SaveButton';
import BackButton from '../components/BackButton';
import sql from "../sql/db";
import AdminClient from "../settingsPage/AdminClient";
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

    const display_status = adminVisibilityByName[name] ?? true;

    return {alarm, display_status};
  });
  return (
    <AdminClient initialAlarms={adminVisibleAlarms} />
  );
}