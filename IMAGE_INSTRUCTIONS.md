# Image Update Instructions

You can easily update the website's favicon (browser tab icon) and the AI Assistant's avatar by replacing the existing image files in the `public` directory. 

## 1. Updating the Website Icon (Favicon)
To change the icon that appears on the top of the browser tab:
1. Locate your new image (preferably a square image like `512x512` pixels in `.svg`, `.png`, or `.ico` format).
2. Save it to the `public/` folder in your project directory: `c:\Users\ssang\Downloads\Portfolio\video-editing-portfolio\public\`
3. If you save it as `favicon.svg` or `favicon.ico`, it will automatically overwrite the existing one.
4. If your new image has a different name, open `index.html` and update the `<link rel="icon" ...>` tag to point to your new file name:
   ```html
   <link rel="icon" type="image/svg+xml" href="/your-new-image.png" />
   ```

## 2. Updating the AI Chatbot Icon
The AI Chatbot uses the image located at `/brand/ai-assistant.jpg`.
To change the image displayed on the AI Chatbot button and header:
1. Locate your new portrait/avatar image. For the best result, it should be a square image (e.g. `400x400` pixels).
2. Save it to the `public/brand/` folder in your project directory: `c:\Users\ssang\Downloads\Portfolio\video-editing-portfolio\public\brand\`
3. Name the new image exactly **`ai-assistant.jpg`**, replacing the existing one.
4. The website will automatically use the new image. If it doesn't update immediately in your browser, try doing a "hard refresh" (Ctrl + F5 or Cmd + Shift + R) to clear the image cache.
