import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { INITIAL_MATTERS } from '@/lib/seedData';
import { Matter } from '@/types';

function escapeCSV(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function POST(request: Request) {
  try {
    let matters: Matter[] = [];
    try {
      const body = await request.json();
      if (Array.isArray(body?.matters) && body.matters.length > 0) {
        matters = body.matters;
      }
    } catch {
      // Body may be empty
    }

    if (matters.length === 0) {
      const db = await getDatabase();
      if (db) {
        matters = await db.collection<Matter>('matters').find({}).sort({ date: -1 }).toArray();
      } else {
        matters = INITIAL_MATTERS;
      }
    }

    const headers = [
      'Matter ID',
      'Date',
      'Priority',
      'Status',
      'Practice Area',
      'Matter Title',
      'Client Reference',
      'Supervising Lawyer',
      'Deadline',
      'Time Spent (Hours)',
      'Confidence Rating (1-5)',
      'Activities Undertaken',
      'Skills & Laws Involved',
      'Lessons Learned',
      'Follow-Up Steps',
      'Total Subtasks',
      'Completed Subtasks',
    ];

    const rows = matters.map((m) => [
      escapeCSV(m.id),
      escapeCSV(m.date),
      escapeCSV(m.priority),
      escapeCSV(m.status),
      escapeCSV(m.practiceArea),
      escapeCSV(m.matterTitle),
      escapeCSV(m.clientReference),
      escapeCSV(m.supervisingLawyer),
      escapeCSV(m.deadline || ''),
      escapeCSV(m.timeSpentHours),
      escapeCSV(m.confidenceRating),
      escapeCSV(m.activitiesDone),
      escapeCSV(m.skillsLawsInvolved),
      escapeCSV(m.lessonsLearned),
      escapeCSV(m.followUpSteps || ''),
      escapeCSV(m.subtasks ? m.subtasks.length : 0),
      escapeCSV(m.subtasks ? m.subtasks.filter((s) => s.completed).length : 0),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    return new NextResponse('\uFEFF' + csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="mla_associate_journal_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function GET() {
  // Support GET by exporting default database or seed matters
  return POST(new Request('http://localhost/api/export', { method: 'POST', body: '{}' }));
}
