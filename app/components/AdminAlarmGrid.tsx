'use client'
import type { MetricAlarm } from "@aws-sdk/client-cloudwatch";
import AlarmCard from "./AlarmCard";

export default function AdminAlarmGrid({
  initialAlarms,
  isAdmin = true,
}: {
  initialAlarms: {alarm: MetricAlarm, display_status: boolean}[];
  isAdmin?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {initialAlarms.map((entry, index) => {
        const alarm = entry.alarm;
        const baseKey = alarm.AlarmArn ?? alarm.AlarmName ?? "alarm";
        return (
        <AlarmCard
          key={`${baseKey}-${index}`}
          alarm={entry.alarm}
          isAdmin={isAdmin}
          visible={entry.display_status}
          onToggleVisible={() => handleToggleVisibility(entry.alarm.AlarmName as string)}
        />
        );
      })}
    </div>
  );
}
