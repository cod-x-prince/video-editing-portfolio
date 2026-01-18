export interface Project {
  id: string;
  title: string;
  role: string;
  client: string;
  year: string;
  description: string;
  thumbnailUrl: string;
  videoUrl?: string; // Optional for this demo
  tags: string[];
}

export interface Reel {
  id: string;
  title: string;
  client: string;
  videoUrl: string;
  posterUrl: string;
  duration: string;
  tags: string[];
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
