import { NextResponse } from 'next/server';
import { checkMongoConnection } from '@/lib/mongodb';

export async function GET() {
  const result = await checkMongoConnection();
  return NextResponse.json(result);
}
