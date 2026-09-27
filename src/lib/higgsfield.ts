export interface HiggsfieldGenerateOptions {
  prompt: string;
  preset?: string;
  motionStrength?: number;
  aspectRatio?: '9:16' | '16:9' | '1:1';
  imageUrl?: string;
  imageUrls?: string[];
  transitionStyle?: string;
  duration?: number;
  videoUrl?: string;
  apiKey?: string;
  baseUrl?: string;
}

export async function generateWithHiggsfield(options: HiggsfieldGenerateOptions) {
  const apiKey = options.apiKey || process.env.HIGGSFIELD_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    throw new Error('No Higgsfield API key found. Please click "Connect Your API Key" to enter your key.');
  }

  const cleanKey = apiKey.trim().replace(/^["']|["']$/g, '');
  const authHeader = cleanKey.startsWith('Key ') || cleanKey.startsWith('Bearer ') 
    ? cleanKey 
    : `Key ${cleanKey}`;

  // Official Higgsfield Video Generation Endpoint
  const endpoint = 'https://api.higgsfield.ai/higgsfield/genjutsu/motion-transfer/v1.0';

  const allImages = options.imageUrls && options.imageUrls.length > 0 
    ? options.imageUrls 
    : (options.imageUrl ? [options.imageUrl] : ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80']);

  try {
    console.log('[Higgsfield API] Submitting generation request to:', endpoint);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        video_url: options.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        image_urls: allImages,
        motion_strength: options.motionStrength || 5,
        prompt: options.prompt,
        aspect_ratio: options.aspectRatio || '16:9',
        transition: options.transitionStyle || 'cross_morph',
        duration_seconds: options.duration || 6
      })
    });

    const data = await res.json().catch(() => ({}));
    console.log('[Higgsfield API Initial Response]:', res.status, data);

    if (res.status === 403) {
      if (data.detail === 'not_enough_credits') {
        throw new Error('Higgsfield API Notice: Your API key is authenticated, but your account has run out of credits ("not_enough_credits"). Please top up credits on higgsfield.ai.');
      }
      throw new Error(`Higgsfield API Error (403 Forbidden): ${data.detail || 'Access denied'}`);
    }

    if (res.status === 401) {
      throw new Error('Invalid Higgsfield API credentials. Please check your KEY_ID:KEY_SECRET in Connect Your API Key.');
    }

    if (!res.ok) {
      throw new Error(`Higgsfield API Error (${res.status}): ${data.detail || data.message || 'Generation request rejected'}`);
    }

    // Direct synchronous video URL if available
    let videoUrl = data.video_url || data.output_url || data.url;

    // Asynchronous polling if status_url is returned
    const statusUrl = data.status_url || (data.request_id ? `https://api.higgsfield.ai/requests/${data.request_id}/status` : null);

    if (!videoUrl && statusUrl) {
      console.log('[Higgsfield API] Task enqueued. Polling status URL:', statusUrl);
      const startTime = Date.now();
      const timeoutMs = 90000; // 90 seconds timeout

      while (Date.now() - startTime < timeoutMs) {
        await new Promise(r => setTimeout(r, 2500));

        try {
          const pollRes = await fetch(statusUrl, {
            headers: {
              'Authorization': authHeader
            }
          });

          if (pollRes.ok) {
            const pollData = await pollRes.json();
            console.log('[Higgsfield Poll]: status =', pollData.status, pollData);

            if (pollData.status === 'completed' || pollData.status === 'succeeded' || pollData.status === 'done') {
              videoUrl = pollData.video_url || pollData.output?.video_url || pollData.result?.video_url || pollData.output_url || pollData.url;
              if (videoUrl) break;
            } else if (pollData.status === 'failed' || pollData.status === 'error') {
              throw new Error(`Higgsfield GPU Generation failed: ${pollData.error || pollData.message || 'Unknown processing error'}`);
            }
          }
        } catch (pollErr: any) {
          console.warn('[Higgsfield Poll Warning]:', pollErr.message);
          if (pollErr.message.includes('failed')) throw pollErr;
        }
      }
    }

    return {
      videoUrl: videoUrl || null,
      thumbnailUrl: data.thumbnail_url || allImages[0],
      provider: 'higgsfield',
      preset: options.preset || 'Kling 3',
      requestId: data.request_id || data.id,
      imagesUsed: allImages
    };
  } catch (err: any) {
    console.error('[Higgsfield Error Details]:', err.message);
    throw err;
  }
}
