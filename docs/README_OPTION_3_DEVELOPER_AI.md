<div align="center">

  <img src="../assets/reloops-hero-banner.jpg" alt="Reloops Developer & AI Platform" width="100%" />

  # Reloops Engine
  ### Developer-First Creative Asset Review, S3/B2 Storage & AI Video Agent Infrastructure

  [![GitHub Stars](https://img.shields.io/github/stars/Reloops-App/Reloops?style=flat-square&color=3B82F6)](https://github.com/Reloops-App/Reloops/stargazers)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
  [![Architecture: Edge API](https://img.shields.io/badge/Architecture-Edge_Functions-6366F1?style=flat-square)](https://api.reloops.app)
  [![MCP Support](https://img.shields.io/badge/Agent_Protocol-MCP_Ready-8B5CF6?style=flat-square)](https://github.com/Reloops-App/Reloops)
  [![Storage: S3 / B2](https://img.shields.io/badge/Storage-S3_%2F_Backblaze_B2-EC5B2D?style=flat-square)](https://reloops.app)

  <p align="center">
    <b>Reloops Engine</b> provides developers, AI engineers, and automation teams with a programmable asset review API, high-speed presigned media ingestion, and agentic video synthesis infrastructure.
  </p>

  <p align="center">
    <a href="#-system-architecture"><strong>Architecture</strong></a>
    ·
    <a href="#-sdk--api-integration"><strong>SDK Reference</strong></a>
    ·
    <a href="#-ai-agent-mcp-integration"><strong>MCP Setup</strong></a>
    ·
    <a href="#-self-hosting--deployment"><strong>Deploy</strong></a>
  </p>

</div>

---

## 🏗️ System Architecture

Reloops decouples the heavy media ingestion pipeline from the application layer using client-side presigned S3/Backblaze B2 URLs, Edge functions, and browser-isolated BYOK key vaults.

```mermaid
sequenceDiagram
    autonumber
    actor User as Client / Editor / AI Agent
    participant WebApp as Next.js 15 Web Studio
    participant EdgeAPI as Reloops Edge API (api.reloops.app)
    participant CloudStorage as Backblaze B2 / S3 Storage
    participant AIEngine as Generative Model (Higgsfield / Kling)

    User->>WebApp: Upload multi-asset sequence (1.png, 2.png, 3.png)
    WebApp->>EdgeAPI: POST /functions/v1/upload-b2/start (Asset Metadata)
    EdgeAPI-->>WebApp: 200 OK (Presigned Direct Upload URLs)
    WebApp->>CloudStorage: Direct Multi-part Binary Upload (Up to 5GB)
    WebApp->>EdgeAPI: POST /functions/v1/upload-b2/complete-single
    EdgeAPI-->>WebApp: Asset Indexed (ast_id, version: 1)
    
    opt Generative Trajectory Synthesis
        WebApp->>AIEngine: POST /v1.0/motion-transfer (BYOK Auth)
        AIEngine-->>WebApp: High-Res 4K Flythrough MP4
    end
    
    WebApp->>User: Instant Frame-Accurate Canvas Player
```

---

## ⚡ Key Architectural Principles

1. **Zero Intermediate Proxying**: Video files (up to 5GB) upload straight from the browser to cloud buckets via presigned multi-part URLs.
2. **Bring-Your-Own-Key (BYOK) Security**: AI provider keys are stored exclusively in client `localStorage` and dispatched with request headers—never persisted to the server database.
3. **Model Context Protocol (MCP) Compatible**: Native support for Anthropic Claude, Google Antigravity, and n8n workflows to manage review queues autonomously.
4. **Frame-Accurate Video Metadata Engine**: Microsecond-precision timecode indexing for comments, annotations, and split-screen comparison diffs.

---

## 📸 Platform Interface

<table>
  <tr>
    <td width="50%">
      <b>Video Review & Annotation Engine</b>
      <img src="../assets/reloops-video-player-review.jpg" alt="Player Engine" width="100%"/>
    </td>
    <td width="50%">
      <b>Multi-Asset AI Trajectory Studio</b>
      <img src="../assets/reloops-ai-agent-studio.jpg" alt="AI Studio" width="100%"/>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <b>Version Comparison Slider</b>
      <img src="../assets/reloops-version-stacking-diff.jpg" alt="Version Diffing" width="100%"/>
    </td>
    <td width="50%">
      <b>Client Share & Approval Portal</b>
      <img src="../assets/reloops-client-share-portal.jpg" alt="Client Portal" width="100%"/>
    </td>
  </tr>
</table>

---

## 💻 SDK & API Integration

### 1. Installation
```bash
npm install @reloops/sdk
```

### 2. Programmatic Review & Version Stacking
```typescript
import { ReloopsClient } from '@reloops/sdk';

const reloops = new ReloopsClient({
  apiKey: process.env.RELOOPS_API_KEY,
  endpoint: 'https://api.reloops.app/functions/v1'
});

async function processReviewQueue() {
  // 1. Fetch unassigned items requiring review
  const queue = await reloops.assignedItems.list({ status: 'needs_review' });

  for (const item of queue) {
    console.log(`Processing review item: ${item.assetName} [${item.id}]`);

    // 2. Add timecode comment
    await reloops.comments.create({
      assetId: item.id,
      timestampSeconds: 4.20,
      content: 'Edge blur detected at 00:04:12. Applying trajectory sharpen pass.'
    });

    // 3. Upload new iteration to the version stack
    await reloops.assets.stackRevision({
      parentAssetId: item.id,
      filePath: './exports/v2_sharpened.mp4',
      status: 'approved'
    });
  }
}

processReviewQueue();
```

---

## 🤖 AI Agent MCP Integration (Antigravity & Claude)

Add the Reloops MCP server configuration to your agent setup (`mcp_config.json`):

```json
{
  "mcpServers": {
    "reloops": {
      "command": "npx",
      "args": ["-y", "@reloops/mcp-server"],
      "env": {
        "RELOOPS_API_KEY": "reloops_live_your_key_here"
      }
    }
  }
}
```

---

## 🚀 Self-Hosting & Deployment

### Quick Docker Deployment
```bash
git clone https://github.com/Reloops-App/Reloops.git
cd Reloops
docker compose up -d
```

---

## 📜 License

Reloops is open-source software licensed under the **MIT License**.
