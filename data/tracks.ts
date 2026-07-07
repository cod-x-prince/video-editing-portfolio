export type MusicTrack = {
  id: string;
  title: string;
  artist: string;
  mood: string;
  src: string;
};

export const musicTracks: MusicTrack[] = [
  {
    id: "track-1",
    title: "Parmbeer Radio 01",
    artist: "Parmbeer Radio",
    mood: "Cinematic",
    src: "/music/track-1.mp3",
  },
  {
    id: "track-2",
    title: "Parmbeer Radio 02",
    artist: "Parmbeer Radio",
    mood: "Smooth",
    src: "/music/track-2.mp3",
  },
  {
    id: "track-3",
    title: "Parmbeer Radio 03",
    artist: "Parmbeer Radio",
    mood: "High energy",
    src: "/music/track-3.mp3",
  },
];
