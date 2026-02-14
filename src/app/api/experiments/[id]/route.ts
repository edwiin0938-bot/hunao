import { NextResponse } from 'next/server';
import { getDb, Experiment } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, status, owner, start_date, end_date, revenue_signal } = body;

    const db = getDb();
    db.prepare(`
      UPDATE experiments 
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          status = COALESCE(?, status),
          owner = COALESCE(?, owner),
          start_date = COALESCE(?, start_date),
          end_date = COALESCE(?, end_date),
          revenue_signal = COALESCE(?, revenue_signal),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, description, status, owner, start_date, end_date, revenue_signal, id);

    const experiment = db.prepare('SELECT * FROM experiments WHERE id = ?').get(id) as Experiment | undefined;
    
    if (!experiment) {
      return NextResponse.json({ error: 'Experiment not found' }, { status: 404 });
    }

    return NextResponse.json(experiment);
  } catch (error) {
    console.error('Failed to update experiment:', error);
    return NextResponse.json({ error: 'Failed to update experiment' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const result = db.prepare('DELETE FROM experiments WHERE id = ?').run(id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Experiment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete experiment:', error);
    return NextResponse.json({ error: 'Failed to delete experiment' }, { status: 500 });
  }
}
