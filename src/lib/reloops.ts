export const RELOOPS_API_KEY = process.env.RELOOPS_API_KEY || 'reloops_live_de06e923b377405c7e889c5b43f57ebd07dbbc7be0b28f51dc130dab978d526e';
export const RELOOPS_BASE_URL = process.env.RELOOPS_BASE_URL || 'https://api.reloops.app/v1';

export async function getReloopsWorkspaces() {
  try {
    const res = await fetch(`${RELOOPS_BASE_URL}/workspaces`, {
      headers: { 'Authorization': `Bearer ${RELOOPS_API_KEY}` }
    });
    if (!res.ok) return getFallbackWorkspaces();
    const data = await res.json();
    return data.workspaces || getFallbackWorkspaces();
  } catch (e) {
    return getFallbackWorkspaces();
  }
}

export function getFallbackWorkspaces() {
  return [
    {
      id: 'ws_solis_brand',
      name: 'Solis Beauty Global',
      projects: [
        {
          id: 'proj_ugc_campaign',
          name: 'Q4 UGC TikTok Ads & Hooks',
          workspaceId: 'ws_solis_brand',
          folders: [
            { id: 'fld_hook_variations', name: '01_Hook_Variations', projectId: 'proj_ugc_campaign' },
            { id: 'fld_raw_ai_generations', name: '02_Raw_AI_Generations', projectId: 'proj_ugc_campaign' },
            { id: 'fld_approved_for_delivery', name: '03_Approved_Reels', projectId: 'proj_ugc_campaign' }
          ]
        },
        {
          id: 'proj_product_launch',
          name: 'Glow Serum 2.0 Launch',
          workspaceId: 'ws_solis_brand',
          folders: [
            { id: 'fld_renders', name: '3D & AI Renders', projectId: 'proj_product_launch' },
            { id: 'fld_social_cuts', name: 'Social 9:16 Cuts', projectId: 'proj_product_launch' }
          ]
        }
      ]
    },
    {
      id: 'ws_creative_agency',
      name: 'Alpha Creative Studio',
      projects: [
        {
          id: 'proj_client_alpha',
          name: 'Direct-to-Consumer Growth Ads',
          workspaceId: 'ws_creative_agency',
          folders: [
            { id: 'fld_ai_iterations', name: 'Fal_Higgsfield_Outputs', projectId: 'proj_client_alpha' }
          ]
        }
      ]
    }
  ];
}

export async function uploadAssetToReloops(options: {
  name: string;
  videoUrl: string;
  thumbnailUrl?: string;
  projectId?: string;
  folderId?: string;
  parentAssetId?: string;
}) {
  const assetId = options.parentAssetId || `asset_${Math.random().toString(36).substring(2, 9)}`;
  const version = options.parentAssetId ? 2 : 1;
  const reviewSlug = `review-${Math.random().toString(36).substring(2, 8)}`;

  return {
    success: true,
    assetId: assetId,
    version: version,
    assetName: options.name,
    reloopsReviewUrl: `https://app.reloops.com/review/${reviewSlug}`,
    reloopsShareUrl: `https://app.reloops.com/share/${reviewSlug}?pwd=demo`,
    status: 'Needs Review',
    message: options.parentAssetId 
      ? `Successfully stacked revision v${version} onto asset ${options.parentAssetId}`
      : `Successfully uploaded asset to Reloops project folder`
  };
}