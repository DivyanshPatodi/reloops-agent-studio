import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get('file') || 'source';

  let filePath = 'C:/Users/rkmeh/reloops/Higgsfield-Companion-MVP-Source.zip';
  let fileName = 'Higgsfield-Companion-MVP-Source.zip';

  if (file === 'source' || file === 'code') {
    filePath = 'C:/Users/rkmeh/reloops/Higgsfield-Companion-MVP-Source.zip';
    fileName = 'Higgsfield-Companion-MVP-Source.zip';
  } else if (file === 'safe' || file === 'source-safe') {
    filePath = 'C:/Users/rkmeh/reloops/Higgsfield-Companion-MVP-Source.zip.safe';
    fileName = 'Higgsfield-Companion-MVP-Source.zip.safe';
  } else if (file === 'v1') {
    filePath = 'C:/Users/rkmeh/reloops/Reloops-Agent-Studio-Full-v1.zip';
    fileName = 'Reloops-Agent-Studio-Full-v1.zip';
  }

  if (!fs.existsSync(filePath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': fileBuffer.length.toString()
    }
  });
}
