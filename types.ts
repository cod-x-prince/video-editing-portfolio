export interface Project {
  id: string;
  title: string;
  role: string;
  client: string;
  year: string;
  description: string;
  thumbnailUrl: string;
  cloudVideoUrl?: string; // Optional for this demo
  tags: string[];
}

export interface Reel {
  id: string;
  title: string;
  client: string;
  cloudVideoUrl: string;
  cloudPosterUrl: string;
  duration: string;
  tags: string[];
  niche?: string;
  description?: string;
  previewTime?: number; // seconds into the video for the preview frame (default: 0.001)
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface PresignedPostResponse {
  url: string;
  fields: Record<string, string>;
  key: string;
}
