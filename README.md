<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1awQpCPNe-GsAkdnRZo8VULOohCsfipAv

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Project Structure

```
addictive-video-editing-portfolio/
├── api/
│   └── presign.ts
├── components/
│   ├── Navigation.tsx
│   ├── ProjectCard.tsx
│   ├── ReelCard.tsx
│   ├── ThreeHero.tsx
│   └── UploadModal.tsx
├── data/
│   └── reels.ts
├── dist/
│   ├── assets/
│   │   └── index-DrV0K1KC.js
│   ├── reels/
│   │   ├── health_sector.mp4
│   │   ├── home_interior.mov
│   │   ├── real_estate.mov
│   │   └── trading_reel.mov
│   └── index.html
├── public/
│   └── reels/
│       ├── health_sector.mp4
│       ├── home_interior.mov
│       ├── real_estate.mov
│       └── trading_reel.mov
├── App.tsx
├── constants.ts
├── index.html
├── index.tsx
├── metadata.json
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
├── types.ts
└── vite.config.ts
```
