# 🎬 Reloops Agent Studio

> **Multi-Asset AI Video Synthesis Studio with Dynamic Camera Trajectories and Bring-Your-Own-Key (BYOK) Architecture.**

Transform multiple image keyframes (e.g. sequence shots `1.png`, `2.png`, `3.png`) into a seamless, continuous photorealistic video flythrough with automatic natural sorting, camera trajectory controls, and real-time cloud video generation.

---

## ✨ Features

- **Multi-Asset Ingestion**: Upload any number of images (e.g., establishing shot ➔ bridge flythrough ➔ downtown street).
- **Intelligent Natural Sorting**: Automatically sorts uploaded files alphanumerically (`1.png` ➔ `2.png` ➔ `3.png`) with manual re-order controls (`◀`, `▶`, `Reverse Sequence`).
- **Camera Trajectories**: Choose between **Cinematic Push-In Flythrough**, **Smooth Sweeping Pan**, and **Dynamic Hyperlapse**.
- **Bring Your Own Key (BYOK)**: Zero hardcoded credentials. Keys are saved securely in your browser's `localStorage` and sent per-request. Supports single API keys, Key ID + Secret pairs, and Bearer tokens.
- **Dual Synthesis Engine**:
  - **Live Cloud Synthesis**: Generates true high-definition MP4 renders via AI video backends (Higgsfield, Kling, Seedance).
  - **Fluid Canvas Compositor**: Zero-latency cinematic interpolation preview with real-time flythrough physics.
- **Export & Deliver**: Direct MP4 downloads and instant variation re-generation.
- **Asset Import**: Preview and import existing generation links directly into the studio.

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/reloops-agent-studio.git
cd reloops-agent-studio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Connecting Your API Key

1. Click the **"Connect API Key"** button in the top right corner of the header.
2. Choose your input mode:
   - **Paste Key (Any Format)**: Paste your full API key string directly.
   - **Enter ID & Secret Separately**: Enter your `Key ID` and `Key Secret` into separate fields.
3. Click **Save Key**. Your key is securely stored in your local browser storage.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Video Synthesis**: REST API Polling + HTML5 Canvas Compositor Engine

---

## 📁 Project Structure

```
reloops-agent-studio/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── connect/      # BYOK connection verification
│   │   │   ├── generate/     # Multi-image synthesis endpoint
│   │   │   └── import/       # External asset importer
│   │   ├── globals.css       # Tailwind CSS styles
│   │   ├── layout.tsx        # App layout wrapper
│   │   └── page.tsx          # Full Studio UI & interactive canvas
│   └── lib/
│       └── higgsfield.ts     # AI generation client & polling loop
├── public/
│   └── uploads/              # Local asset buffer
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📄 License

MIT License. Open-source and free to customize.
