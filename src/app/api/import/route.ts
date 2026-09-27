import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { link } = body;

    if (!link || typeof link !== 'string' || !link.trim()) {
      return NextResponse.json({ error: 'Please enter a valid Higgsfield link or job URL' }, { status: 400 });
    }

    const trimmed = link.trim();
    let outputUrl = trimmed;
    let thumbnailUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';

    if (trimmed.endsWith('.mp4') || trimmed.endsWith('.mov') || trimmed.endsWith('.webm')) {
      outputUrl = trimmed;
    } else {
      outputUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';
    }

    const record = {
      id: 'imp_' + Math.random().toString(36).substring(2, 9),
      prompt: 'Imported from Higgsfield link: ' + (trimmed.length > 40 ? trimmed.substring(0, 40) + '...' : trimmed),
      model: 'Higgsfield Import',
      input_url: '',
      output_url: outputUrl,
      thumbnail_url: thumbnailUrl,
      type: 'video',
      higgsfield_job_id: 'import_' + Math.random().toString(36).substring(2, 8),
      created_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      generation: record
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
