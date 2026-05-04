import type { MetricAlarm } from "@aws-sdk/client-cloudwatch";
import AlarmCard from "./AlarmCard";

export default function ClientAlarmGrid({
  alarms,
  isAdmin = false,
}: {
  alarms: MetricAlarm[];
  isAdmin?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {alarms.map((alarm) => (
        <AlarmCard
          key={alarm.AlarmArn ?? alarm.AlarmName}
          alarm={alarm}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}