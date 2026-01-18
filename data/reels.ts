import { Reel } from "../types";

export const reels: Reel[] = [
  {
    id: "1",
    title: "Health Sector",
    client: "Healthcare Client",
    videoUrl: "/reels/health_sector.mp4",
    posterUrl: "https://picsum.photos/id/1/450/800", // Placeholder poster
    duration: "0:30", // Placeholder duration
    tags: ["Health", "Corporate"],
  },
  {
    id: "2",
    title: "Home Interior",
    client: "Design Co",
    videoUrl: "/reels/home_interior.mov",
    posterUrl: "https://picsum.photos/id/2/450/800",
    duration: "0:30",
    tags: ["Interior", "Design"],
  },
  {
    id: "3",
    title: "Real Estate",
    client: "Estate Agency",
    videoUrl: "/reels/real_estate.mov",
    posterUrl: "https://picsum.photos/id/3/450/800",
    duration: "0:30",
    tags: ["Real Estate", "Property"],
  },
  {
    id: "4",
    title: "Trading Reel",
    client: "Finance Corp",
    videoUrl: "/reels/trading_reel.mov",
    posterUrl: "https://picsum.photos/id/4/450/800",
    duration: "0:30",
    tags: ["Finance", "Trading"],
  },
];
