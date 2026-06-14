import type { MetricAlarm } from '@aws-sdk/client-cloudwatch';

type AdminAlarm = {
  alarm: MetricAlarm;
  display_status: boolean;
};

export default async function saveHandler(alarms: AdminAlarm[]) {
  const payload = alarms
    .filter((entry) => entry.alarm.AlarmName)
    .map((entry) => ({
      name: entry.alarm.AlarmName!,
      display_status: entry.display_status,
    }));

  console.log('Saving payload:', payload);

  const response = await fetch('/api/alarms/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Save API failed:', data);
    throw new Error(data.error ?? 'Failed to save alarm visibility settings');
  }

  return data;
}