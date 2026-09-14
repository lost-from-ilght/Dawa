import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { DailyTask } from '@/types';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const db = await getDatabase();
    if (db) {
      const collection = db.collection<DailyTask>('tasks');
      await collection.updateOne({ id }, { $set: body });
      const updated = await collection.findOne({ id });
      return NextResponse.json({ success: true, data: updated, source: 'mongodb' });
    }

    return NextResponse.json({ success: true, data: { ...body, id }, source: 'fallback' });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err?.message || 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    if (db) {
      const collection = db.collection<DailyTask>('tasks');
      await collection.deleteOne({ id });
      return NextResponse.json({ success: true, id, source: 'mongodb' });
    }

    return NextResponse.json({ success: true, id, source: 'fallback' });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err?.message || 'Failed to delete task' }, { status: 500 });
  }
}
