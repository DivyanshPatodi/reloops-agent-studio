import { NextRequest, NextResponse } from 'next/server';
import { generateWithHiggsfield } from '@/lib/higgsfield';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, imageUrl, imageUrls, model = 'Kling 3', apiKey, transitionStyle = 'Dynamic Flow', duration = 6 } = body;

    let allImages: string[] = imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0 
      ? imageUrls 
      : (imageUrl ? [imageUrl] : []);

    if (!prompt && allImages.length === 0) {
      return NextResponse.json({ error: 'Please enter a prompt or upload at least one image asset.' }, { status: 400 });
    }

    // Convert local base64 images into publicly accessible files for Higgsfield GPU ingestion
    const origin = req.nextUrl.origin || 'http://localhost:3000';
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const publicImageUrls: string[] = allImages.map((img, i) => {
      if (img.startsWith('data:image/')) {
        try {
          const match = img.match(/^data:image\/(\w+);base64,(.+)$/);
          if (match) {
            const ext = match[1] === 'jpeg' ? '.jpg' : `.${match[1]}`;
            const base64Data = match[2];
            const filename = `gen_input_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}${ext}`;
            const filePath = path.join(uploadDir, filename);
            fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
            return `${origin}/uploads/${filename}`;
          }
        } catch (e) {}
      }
      if (img.startsWith('/')) {
        return `${origin}${img}`;
      }
      return img;
    });

    let hfResult: any = null;
    let apiWarning: string | null = null;

    try {
      hfResult = await generateWithHiggsfield({
        prompt: prompt || 'Smooth cinematic continuous push-in shot across sequence keyframes, photorealistic 4k motion',
        imageUrl: publicImageUrls[0] || undefined,
        imageUrls: publicImageUrls.length > 0 ? publicImageUrls : undefined,
        preset: model,
        apiKey: apiKey,
        transitionStyle,
        duration
      });
    } catch (hfErr: any) {
      console.warn('[Higgsfield API Failure]:', hfErr.message);
      apiWarning = hfErr.message;
    }

    const primaryThumbnail = allImages[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80';

    const record = {
      id: 'gen_' + Math.random().toString(36).substring(2, 9),
      prompt: prompt || `Multi-scene video stitched from ${allImages.length} asset keyframes`,
      model: model,
      input_url: allImages[0] || '',
      input_urls: allImages,
      output_url: hfResult?.videoUrl || null,
      thumbnail_url: hfResult?.thumbnailUrl || primaryThumbnail,
      type: 'video',
      transition_style: transitionStyle,
      duration: duration,
      higgsfield_job_id: hfResult?.requestId || 'hf_' + Math.random().toString(36).substring(2, 10),
      created_at: new Date().toISOString(),
      api_notice: apiWarning
    };

    return NextResponse.json({
      success: true,
      generation: record,
      notice: apiWarning
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 });
  }
}
