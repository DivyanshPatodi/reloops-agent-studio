<div align="center">

  <img src="../assets/reloops-hero-banner.jpg" alt="Reloops Creative Studio" width="100%" />

  # Reloops Studio
  ### Open-Source Video Review, Frame Annotation & Version Control for Post-Production

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
  [![Video: 4K 60fps](https://img.shields.io/badge/Video_Engine-4K_%2F_60fps-black?style=flat-square&logo=vlcmediaplayer)](https://reloops.app)
  [![SMPTE Timecode](https://img.shields.io/badge/Timecode-SMPTE_Accurate-green?style=flat-square)](https://reloops.app)
  [![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

  <p align="center">
    <b>Reloops</b> is the open-source Frame.io alternative built for film editors, VFX artists, and agency teams. Streamline client cuts, draw feedback directly on video frames, and diff iterations side-by-side.
  </p>

  <p align="center">
    <a href="https://reloops.app"><strong>Live Studio Demo »</strong></a>
    ·
    <a href="#-editorial-workflow"><strong>Editorial Workflow</strong></a>
    ·
    <a href="#-video-player-capabilities"><strong>Player Features</strong></a>
    ·
    <a href="#-self-hosting--installation"><strong>Self-Host</strong></a>
  </p>

</div>

---

## 🎬 Built for the Post-Production Pipeline

Traditional creative feedback is messy, scattered across email threads, and imprecise. Reloops brings precision editorial review and AI video synthesis into one unified, open-source workflow.

```
+-----------------------------------------------------------------------------------+
|  [ Upload Cut (4K / B2 S3) ] ──> [ Frame-Accurate Review ] ──> [ Client Approval ]|
|                                            │                                      |
|                                            ▼                                      |
|                             [ Version Stacking Diff (v1/v2) ]                     |
|                                            │                                      |
|                                            ▼                                      |
|                             [ AI Trajectory Video Expansion ]                     |
+-----------------------------------------------------------------------------------+
```

---

## 🔍 Core Editorial Tools

### 1. Frame-Accurate Video Markup & Timecode Comments
Review 4K video with zero lag. Draw arrows, highlight visual artifacts with bounding boxes, and timestamp comments down to the exact millisecond (`00:04:12:00`).

<div align="center">
  <img src="../assets/reloops-video-player-review.jpg" alt="Video Review Markup" width="92%" />
</div>

* **SMPTE Timecode Display**: True 23.98, 24, 29.97, and 60 fps precision.
* **On-Canvas Annotation Pen**: Color-coded brushes, bounding boxes, arrows, and blur regions.
* **Threaded Feedback**: Nested reviewer replies with automated timecode links.

---

### 2. Side-by-Side Version Diffing & Stack Tracking
Never lose track of revision requests. Use the interactive comparison slider to inspect color grade passes, VFX composites, and edit changes between `v1.0` and `v2.0`.

<div align="center">
  <img src="../assets/reloops-version-stacking-diff.jpg" alt="Version Diffing Slider" width="92%" />
</div>

* **Split Comparison Slider**: Real-time dual-canvas playback comparison.
* **Linear Revision Stacks**: Automated version numbering with changelog comments.
* **Instant Status Workflow**: Mark versions as `Needs Review`, `In Review`, or `Approved`.

---

### 3. Multi-Asset Generative Video Studio
Upload multiple reference shots (`1.png ➔ 2.png ➔ 3.png`), select a motion trajectory (*Cinematic Push-In, Smooth Pan, Hyperlapse*), and synthesize photorealistic continuous motion passes with Bring-Your-Own-Key (BYOK) privacy.

<div align="center">
  <img src="../assets/reloops-ai-agent-studio.jpg" alt="AI Agent Studio" width="92%" />
</div>

---

### 4. Zero-Friction Client Review Rooms
Send password-protected review links to external stakeholders. Clients can play the cut, comment on frames, and click **"Approve Cut"** without creating an account.

<div align="center">
  <img src="../assets/reloops-client-share-portal.jpg" alt="Client Share Portal" width="92%" />
</div>

---

## 📦 Self-Hosting & Installation

### Local Setup (Quickest)

```bash
# 1. Clone Reloops
git clone https://github.com/Reloops-App/Reloops.git
cd Reloops

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local

# 4. Start Studio
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start reviewing assets.

---

## ⚖️ Reloops vs. Legacy Review Tools

| Capability | Reloops (Open-Source) | Frame.io | Google Drive / Dropbox |
|---|:---:|:---:|:---:|
| **Frame-Accurate Timecode** | ✅ | ✅ | ❌ |
| **On-Screen Canvas Markup** | ✅ | ✅ | ❌ |
| **Interactive Version Slider** | ✅ | ✅ | ❌ |
| **AI Video Flythrough Studio** | ✅ | ❌ | ❌ |
| **Bring-Your-Own-Key (BYOK)**| ✅ | ❌ | ❌ |
| **Self-Hostable & Open Source**| ✅ (MIT) | ❌ (Proprietary) | ❌ |

---

## 📜 License

Reloops is released under the **MIT License**. Free for personal, studio, and commercial use.
