import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const key = body.apiKey || process.env.HIGGSFIELD_API_KEY;

    if (!key || typeof key !== 'string' || !key.trim()) {
      return NextResponse.json({
        connected: false,
        error: 'Please provide your Higgsfield API key.'
      }, { status: 400 });
    }

    const trimmed = key.trim();
    if (!trimmed.includes(':')) {
      return NextResponse.json({
        connected: false,
        error: 'Invalid Higgsfield API key format. Expected KEY_ID:KEY_SECRET'
      }, { status: 400 });
    }

    const parts = trimmed.split(':');
    const keyHint = parts[0].substring(0, Math.min(6, parts[0].length)) + '...' + (parts[1]?.length > 4 ? parts[1].substring(parts[1].length - 4) : '****');

    return NextResponse.json({
      connected: true,
      provider: 'Higgsfield AI',
      keyHint: keyHint,
      message: 'Higgsfield account successfully connected.'
    });
  } catch (error: any) {
    return NextResponse.json({ connected: false, error: error.message }, { status: 500 });
  }
}
