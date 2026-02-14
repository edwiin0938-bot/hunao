import { NextResponse } from 'next/server';
import { getDb, Experiment } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const experiments = db.prepare('SELECT * FROM experiments ORDER BY created_at DESC').all() as Experiment[];
    return NextResponse.json(experiments);
  } catch (error) {
    console.error('Failed to fetch experiments:', error);
    return NextResponse.json({ error: 'Failed to fetch experiments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, status, owner, start_date, end_date, revenue_signal } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare(`
      INSERT INTO experiments (name, description, status, owner, start_date, end_date, revenue_signal)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, description || null, status || 'todo', owner || null, start_date || null, end_date || null, revenue_signal || null);

    const experiment = db.prepare('SELECT * FROM experiments WHERE id = ?').get(result.lastInsertRowid) as Experiment;
    return NextResponse.json(experiment, { status: 201 });
  } catch (error) {
    console.error('Failed to create experiment:', error);
    return NextResponse.json({ error: 'Failed to create experiment' }, { status: 500 });
  }
}
