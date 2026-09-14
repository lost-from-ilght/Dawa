import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { INITIAL_TASKS } from '@/lib/seedData';
import { DailyTask } from '@/types';

export async function GET() {
  try {
    const db = await getDatabase();
    if (db) {
      const collection = db.collection<DailyTask>('tasks');
      let tasks = await collection.find({}).sort({ createdAt: -1 }).toArray();
      if (tasks.length === 0) {
        await collection.insertMany(INITIAL_TASKS);
        tasks = await collection.find({}).sort({ createdAt: -1 }).toArray();
      }
      return NextResponse.json({ success: true, data: tasks, source: 'mongodb' });
    }
  } catch (error) {
    console.warn('API /api/tasks fallback:', error);
  }

  return NextResponse.json({ success: true, data: INITIAL_TASKS, source: 'fallback' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTask: DailyTask = {
      ...body,
      id: body.id || `task-${Date.now()}`,
      createdAt: body.createdAt || new Date().toISOString(),
      completed: Boolean(body.completed),
      isMatterSubtask: Boolean(body.isMatterSubtask),
    };

    const db = await getDatabase();
    if (db) {
      const collection = db.collection<DailyTask>('tasks');
      await collection.insertOne(newTask);
      return NextResponse.json({ success: true, data: newTask, source: 'mongodb' }, { status: 201 });
    }

    return NextResponse.json({ success: true, data: newTask, source: 'fallback' }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err?.message || 'Failed to create task' }, { status: 500 });
  }
}
