# Brand Assets

Add your Spotify icon here as:

- `spotify-icon.svg` preferred, square SVG with transparent background
- If using PNG, export `512x512`, transparent background, then either convert to SVG name or update `SPOTIFY_ICON_PATH` in `components/MusicPlayer.tsx`

The player is already wired to `/brand/spotify-icon.svg` and will show a safe fallback icon until this file exists.
