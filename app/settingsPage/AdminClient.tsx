'use client';

import { useRouter } from 'next/navigation';
import saveHandler from '../lib/saveHandler';
import { useState } from 'react';
import type { MetricAlarm } from '@aws-sdk/client-cloudwatch';
import SaveButton from '../components/SaveButton';
import BackButton from '../components/BackButton';
import AdminAlarmGrid from "../components/AdminAlarmGrid";

type AdminAlarm = { alarm:MetricAlarm; display_status:boolean };


export default function AdminClient({ 
	initialAlarms, 
}: {
	initialAlarms: AdminAlarm[];
}) {
	const router = useRouter();
	const [alarms, setAlarms] = useState<AdminAlarm[]>(initialAlarms);
	function handleToggleVisible(alarmName: String) {
	    setAlarms(prev => 
	        prev.map(entry => {
	          const name = entry.alarm.AlarmName ?? "Not found";
	          if (name == alarmName) {
	            return { ...entry, display_status: !entry.display_status };
	          }
	          return entry;
	        })
	      );
	}
	async function handleSave() {
		try {
			await saveHandler(alarms);
			router.refresh();
			alert('Alarm visibility saved');
		} catch (error) {
			console.error(error);
			alert('Failed to save alarm visibility');
		}
	}
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
            <SaveButton onSave={handleSave} />
          </div>
        </header>
        <AdminAlarmGrid initialAlarms={alarms} isAdmin onToggleVisible={handleToggleVisible} />
      </div>
    </main>
    );
}
