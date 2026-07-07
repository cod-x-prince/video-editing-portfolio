# Music Player System - Developer Guide

## 🎯 Quick Reference

### Event System Architecture

```
MusicPlayer → emits "music:state" → AudioWaveform listens
ReelViewer  → emits "portfolio:video-start" → MusicPlayer pauses
ReelViewer  → emits "portfolio:video-end" → MusicPlayer resumes
```

### Custom Events Available

#### `music:state` (Emitted by MusicPlayer)
```typescript
window.dispatchEvent(
  new CustomEvent("music:state", {
    detail: { 
      playing: boolean,      // Is music currently playing?
      level: number         // Audio energy level (0-1)
    },
  })
);
```
**Usage**: Subscribe to audio state changes for waveforms, visualizers, or status displays

#### `portfolio:pause-music` (External music control)
```typescript
window.dispatchEvent(new CustomEvent("portfolio:pause-music"));
```
**Usage**: External components can pause music when needed

#### `portfolio:video-start` (Emitted by ReelViewer on mount)
```typescript
window.dispatchEvent(new CustomEvent("portfolio:video-start"));
```
**Usage**: Signals music player to pause (video starts playing)

#### `portfolio:video-end` (Emitted by ReelViewer on unmount)
```typescript
window.dispatchEvent(new CustomEvent("portfolio:video-end"));
```
**Usage**: Signals music player to resume (video stopped playing)

---

## 🔧 Component Integration Guide

### Adding a New Audio Visualizer

```typescript
import React, { useEffect, useState } from 'react';

export const MyVisualizer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    const handleMusicState = (event: Event) => {
      const customEvent = event as CustomEvent<{
        playing: boolean;
        level: number;
      }>;
      setIsPlaying(customEvent.detail.playing);
      setLevel(customEvent.detail.level);
    };

    window.addEventListener("music:state", handleMusicState);
    return () => window.removeEventListener("music:state", handleMusicState);
  }, []);

  return (
    <div className="my-visualizer">
      {isPlaying && <YourVisualization level={level} />}
    </div>
  );
};
```

### Pausing Music from Another Component

```typescript
function MyButton() {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("portfolio:pause-music"));
  };

  return <button onClick={handleClick}>Pause Music</button>;
}
```

### Detecting Video Playback

```typescript
useEffect(() => {
  const handleVideoStart = () => {
    console.log("Video started - music should pause");
  };

  const handleVideoEnd = () => {
    console.log("Video ended - music should resume");
  };

  window.addEventListener("portfolio:video-start", handleVideoStart);
  window.addEventListener("portfolio:video-end", handleVideoEnd);

  return () => {
    window.removeEventListener("portfolio:video-start", handleVideoStart);
    window.removeEventListener("portfolio:video-end", handleVideoEnd);
  };
}, []);
```

---

## 📊 Z-Index Reference

Keep these z-index values in mind when adding new components:

```
0       - Background, base layers
15      - AudioWaveform (visualization layer)
10      - Main content wrapper
20-50   - Modals, overlays, dropdowns
60      - Music player (docked)
80      - Music player (compact mode)
9999    - Intro loader (top)
10010   - Music player (initial state)
```

**Rule**: Always check existing z-index values before adding new components to avoid overlap issues.

---

## 🎨 Styling Your Visualizer

### CSS Classes Available

```css
/* Use these CSS variables for theming */
:root {
  --theme-accent: #c4871f;      /* Primary accent (golden) */
  --radio-black: #050507;        /* Dark background */
  --radio-surface: #101114;      /* Surface color */
  --theme-bg: #fafaf8;          /* Light background */
}

/* Spotify-inspired palette */
:root {
  --spotify-green: #1db954;
  --dark: #18181b;
  --light: #fafaf8;
  --accent: #d97706;            /* Golden/amber */
}
```

### Smooth Fade Transitions

```css
.your-visualizer {
  opacity: 0;
  transition: opacity 700ms cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;           /* Don't capture clicks */
  z-index: 15;                    /* Below main content */
}

.your-visualizer.is-active {
  opacity: 0.4;                   /* 40% transparent */
}
```

---

## 🚀 Performance Tips

### Canvas Rendering Best Practices

```typescript
// ✅ GOOD: Use requestAnimationFrame
const animate = () => {
  // Draw to canvas
  frameId = requestAnimationFrame(animate);
};
animate();

// ✅ GOOD: Clear canvas before drawing
ctx.clearRect(0, 0, canvas.width, canvas.height);

// ✅ GOOD: Use offscreen canvas for complex operations
const offscreen = new OffscreenCanvas(width, height);
const ctx = offscreen.getContext('2d');

// ❌ BAD: Don't create new gradients every frame
for (let i = 0; i < bars; i++) {
  const gradient = ctx.createLinearGradient(...); // Creates new gradient each time!
}

// ✅ BETTER: Create gradients once
const gradient = ctx.createLinearGradient(...);
ctx.fillStyle = gradient;
for (let i = 0; i < bars; i++) {
  ctx.fillRect(...);
}
```

### Memory Management

```typescript
useEffect(() => {
  // Cleanup on unmount
  return () => {
    if (frameId) cancelAnimationFrame(frameId);
    if (audioContext) audioContext.close();
    
    // Remove event listeners
    window.removeEventListener("music:state", handler);
  };
}, []);
```

### Audio Context Lifecycle

```typescript
// Resume AudioContext if suspended (required for Web Audio API)
if (audioContext.state === "suspended") {
  await audioContext.resume();
}

// Always close context when done
audioContext.close();
```

---

## 🧪 Testing Patterns

### Testing Event Emission

```typescript
// Setup
window.addEventListener("music:state", (e: Event) => {
  const event = e as CustomEvent;
  expect(event.detail.playing).toBe(true);
});

// Trigger
window.dispatchEvent(
  new CustomEvent("music:state", {
    detail: { playing: true, level: 0.5 }
  })
);
```

### Testing Canvas Rendering

```typescript
const canvas = document.querySelector('canvas');
const ctx = canvas?.getContext('2d');

// Mock canvas context
jest.spyOn(ctx!, 'fillRect').mockImplementation();

// Test rendering
expect(ctx?.fillRect).toHaveBeenCalled();
```

### Testing Component Lifecycle

```typescript
test('removes event listeners on unmount', () => {
  const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
  
  const { unmount } = render(<YourComponent />);
  unmount();
  
  expect(removeEventListenerSpy).toHaveBeenCalledWith(
    'music:state',
    expect.any(Function)
  );
});
```

---

## 🔍 Debugging Guide

### Enable Visual Debugging

```typescript
// In AudioWaveform.tsx, add debug flag
const DEBUG = true;

if (DEBUG) {
  console.log('Music state:', { playing, level });
  console.log('Canvas dimensions:', canvas.width, canvas.height);
  console.log('Frame count:', frameCount);
}
```

### Monitor Performance

```typescript
// Add performance markers
performance.mark('waveform-start');
// ... rendering code ...
performance.mark('waveform-end');
performance.measure('waveform', 'waveform-start', 'waveform-end');

const measure = performance.getEntriesByName('waveform')[0];
console.log('Waveform render time:', measure.duration, 'ms');
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Waveform not appearing | Check `music:state` event firing, verify z-index, check canvas context availability |
| Waveform showing but not animating | Verify `requestAnimationFrame` is running, check canvas context, ensure `isPlaying` is true |
| Audio conflicts | Ensure video sync events fire correctly, verify `wasPlayingRef` is tracked |
| Memory leak | Check `cancelAnimationFrame` in cleanup, verify event listeners removed, close `AudioContext` |
| Performance issues | Use Performance API to measure, reduce bar count, optimize gradient creation |
| Canvas too blurry | Adjust `filter: blur()` value, check device pixel ratio scaling |

---

## 📚 File Reference

### Key Files

| File | Purpose | Key Exports |
|------|---------|------------|
| `components/MusicPlayer.tsx` | Main music player | MusicPlayer component, event emitter |
| `components/AudioWaveform.tsx` | Waveform visualizer | AudioWaveform component |
| `components/ReelViewer.tsx` | Video modal | ReelViewer component, sync events |
| `App.tsx` | App root | Orchestrates all components |
| `index.css` | Styling | CSS classes and animations |
| `data/tracks.ts` | Music data | Track definitions |

### CSS Classes Reference

```css
.music-player              /* Main player container */
.music-player--visible     /* Player is visible */
.music-player--docked      /* Player docked to hero */
.music-player--compact     /* Compact circular mode */
.is-playing               /* Music is playing */

.audio-waveform           /* Waveform container */
.audio-waveform.is-active /* Waveform is visible */
.audio-waveform__canvas   /* Canvas element */
```

---

## 🚀 Deployment Checklist

Before deploying changes to music player:

- [ ] Build succeeds: `npm run build`
- [ ] Dev server runs: `npm run dev`
- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] No console errors in browser
- [ ] Music plays and pauses correctly
- [ ] Waveform appears when playing
- [ ] Video sync works (pause/resume)
- [ ] Loader animation duration correct
- [ ] Responsive on mobile/tablet/desktop
- [ ] All event listeners clean up
- [ ] No memory leaks on repeated play/pause

---

## 📞 Getting Help

### Common Questions

**Q: How do I add a new track?**
A: Add to `data/tracks.ts` following the existing format with `title`, `artist`, `mood`, and `src` properties.

**Q: Can I use a different audio library?**
A: The system uses Web Audio API. You can replace MusicPlayer but must maintain the `music:state` event interface for compatibility.

**Q: How do I customize colors?**
A: Update CSS variables in `index.css` and component color values. The golden accent `#d97706` is used throughout.

**Q: What about mobile performance?**
A: Canvas rendering is efficient on mobile. Reduce bar count (WAVEFORM_BARS) if performance is an issue on low-end devices.

**Q: Can I use this in other projects?**
A: Yes! The components are self-contained and can be adapted by maintaining the event interface and z-index structure.

---

## 🎓 Learning Resources

- **Web Audio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **Canvas API**: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- **Custom Events**: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/

---

## 📝 Changelog

### v1.0 - Initial Release
- ✅ Premium Spotify-inspired music player
- ✅ Audio waveform visualizer (canvas-based)
- ✅ Video/music auto sync
- ✅ Enhanced loader (+1.5s duration)
- ✅ Proper z-index layering
- ✅ Full responsive design
- ✅ Accessibility support

---

**Last Updated**: [Current Session]
**Maintained By**: Development Team
**Status**: ✅ Production Ready
