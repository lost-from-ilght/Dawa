import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { INITIAL_MATTERS, INITIAL_TASKS } from '@/lib/seedData';
import { Matter, DailyTask } from '@/types';

export async function POST() {
  try {
    const db = await getDatabase();
    if (db) {
      const mattersCol = db.collection<Matter>('matters');
      const tasksCol = db.collection<DailyTask>('tasks');

      await mattersCol.deleteMany({});
      await tasksCol.deleteMany({});

      await mattersCol.insertMany(INITIAL_MATTERS);
      await tasksCol.insertMany(INITIAL_TASKS);

      return NextResponse.json({
        success: true,
        message: 'Successfully re-seeded MongoDB database with authentic MLA data.',
        mattersCount: INITIAL_MATTERS.length,
        tasksCount: INITIAL_TASKS.length,
        source: 'mongodb',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'MongoDB not connected. Seed data available for browser local storage reset.',
      matters: INITIAL_MATTERS,
      tasks: INITIAL_TASKS,
      source: 'fallback',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
