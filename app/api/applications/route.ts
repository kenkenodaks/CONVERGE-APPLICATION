import { NextRequest, NextResponse } from 'next/server';
import { listApplications } from '@/lib/googleDrive';

export async function GET(request: NextRequest) {
  // ── Auth ─────────────────────────────────────────────────────────
  const authHeader = request.headers.get('authorization');
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret) {
    return NextResponse.json(
      { error: 'Admin access is not configured on this server.' },
      { status: 503 }
    );
  }

  if (authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Fetch ────────────────────────────────────────────────────────
  try {
    const applications = await listApplications();
    return NextResponse.json({ success: true, data: applications });
  } catch (err) {
    console.error('[applications]', err);

    const message =
      err instanceof Error ? err.message : 'Failed to fetch applications from Google Drive.';

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
