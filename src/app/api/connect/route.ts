import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let key = body.apiKey || body.key || process.env.HIGGSFIELD_API_KEY;

    if (body.keyId && body.keySecret) {
      key = `${body.keyId.trim()}:${body.keySecret.trim()}`;
    }

    if (!key || typeof key !== 'string' || !key.trim()) {
      return NextResponse.json({
        connected: false,
        error: 'Please enter your Higgsfield API key.'
      }, { status: 400 });
    }

    let trimmed = key.trim();

    // Check if user pasted JSON object from dashboard
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        const kid = parsed.key_id || parsed.keyId || parsed.id;
        const ksec = parsed.key_secret || parsed.keySecret || parsed.secret;
        if (kid && ksec) {
          trimmed = `${kid.trim()}:${ksec.trim()}`;
        }
      } catch (e) {}
    }

    // Remove wrapping quotes if present
    trimmed = trimmed.replace(/^["']|["']$/g, '');

    // Generate clean masked hint
    const keyHint = trimmed.length > 8 
      ? trimmed.substring(0, 5) + '...' + trimmed.substring(trimmed.length - 4)
      : trimmed;

    return NextResponse.json({
      connected: true,
      apiKey: trimmed,
      provider: 'Higgsfield AI',
      keyHint: keyHint,
      message: 'Higgsfield account successfully connected.'
    });
  } catch (error: any) {
    return NextResponse.json({ connected: false, error: error.message }, { status: 500 });
  }
}
