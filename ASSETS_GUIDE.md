# Asset Customization Guide

This guide explains where to add and replace images for the **AI Assistant Avatar** and the **Website Browser Favicon**.

---

## 1. AI Assistant Avatar Icon
The chatbot is pre-configured to automatically look for and render a custom profile picture at:
📁 **`public/brand/ai-assistant.jpg`**

### Steps to Customize:
1. Crop your desired photo to a **square** aspect ratio (the browser will automatically display it as a smooth circle).
2. Save the image in **JPG** format and name it **`ai-assistant.jpg`** (ensure lowercase file extension).
3. Place the file inside the project directory at `public/brand/` (overwriting any fallback files).
4. Restart your development server or refresh the browser to see your custom picture.

> [!NOTE]
> If this file is missing or fails to load, the chat interface is built to automatically fall back to a gold gradient circle with a fallback icon, so the website will never break!

---

## 2. Website Favicon (Browser Tab Icon)
The browser tab icon displayed next to the website title is loaded from:
📁 **`public/favicon.png`**

### Steps to Customize:
1. Design or export your custom logo or icon.
2. Save it in **PNG** format with transparent background at standard icon dimensions (e.g., **32x32px** or **64x64px**).
3. Name it **`favicon.png`**.
4. Replace the existing `favicon.png` inside the `public/` folder.

---

## 3. Verify Changes
After adding the files, run or reload your local development server:
```bash
npm run dev
```
And clear your browser cache (usually **Ctrl + F5** or **Cmd + Shift + R**) to make sure the browser loads your new assets instead of the old cached versions!
