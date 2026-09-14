import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { INITIAL_MATTERS } from '@/lib/seedData';
import { Matter } from '@/types';

export async function GET() {
  try {
    const db = await getDatabase();
    if (db) {
      const collection = db.collection<Matter>('matters');
      let matters = await collection.find({}).sort({ date: -1 }).toArray();
      if (matters.length === 0) {
        await collection.insertMany(INITIAL_MATTERS);
        matters = await collection.find({}).sort({ date: -1 }).toArray();
      }
      return NextResponse.json({ success: true, data: matters, source: 'mongodb' });
    }
  } catch (error) {
    console.warn('API /api/matters fallback:', error);
  }

  // Fallback to initial matters
  return NextResponse.json({ success: true, data: INITIAL_MATTERS, source: 'fallback' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newMatter: Matter = {
      ...body,
      id: body.id || `mla-m-${Date.now()}`,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: body.subtasks || [],
      confidenceRating: Number(body.confidenceRating) || 3,
      timeSpentHours: Number(body.timeSpentHours) || 1,
    };

    const db = await getDatabase();
    if (db) {
      const collection = db.collection<Matter>('matters');
      await collection.insertOne(newMatter);
      return NextResponse.json({ success: true, data: newMatter, source: 'mongodb' }, { status: 201 });
    }

    return NextResponse.json({ success: true, data: newMatter, source: 'fallback' }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err?.message || 'Failed to create matter' }, { status: 500 });
  }
}
