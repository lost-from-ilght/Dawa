import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Matter } from '@/types';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedData: Partial<Matter> = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    const db = await getDatabase();
    if (db) {
      const collection = db.collection<Matter>('matters');
      await collection.updateOne({ id }, { $set: updatedData });
      const updated = await collection.findOne({ id });
      return NextResponse.json({ success: true, data: updated, source: 'mongodb' });
    }

    return NextResponse.json({ success: true, data: { ...body, id, updatedAt: new Date().toISOString() }, source: 'fallback' });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err?.message || 'Failed to update matter' }, { status: 500 });
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
      const collection = db.collection<Matter>('matters');
      await collection.deleteOne({ id });
      return NextResponse.json({ success: true, id, source: 'mongodb' });
    }

    return NextResponse.json({ success: true, id, source: 'fallback' });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err?.message || 'Failed to delete matter' }, { status: 500 });
  }
}
