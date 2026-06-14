import { NextResponse } from 'next/server';
import sql from '@/app/sql/db';

type AlarmVisibilityPayload = {
	name: string,
	display_status: boolean;
};

export async function POST(request: Request) {
	try {
		const alarms = (await request.json()) as AlarmVisibilityPayload[];

		for (const alarm of alarms) {
			await sql `
				INSERT INTO alarms (name, display_status)
				VALUES (${alarm.name}, ${alarm.display_status})
				ON CONFLICT (name)
				DO UPDATE SET display_status = EXCLUDED.display_status
			`;
		}

		return NextResponse.json({
			ok:true
		});
	} catch(error) {
		console.error('Failed to save alarms:', error)

		return NextResponse.json(
			{
				ok:false,
				error: 'Failed to save alarm visibility settings',
			},
			{
				status: 500,
			}
		);
	}
}