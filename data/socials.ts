export interface SocialLink {
  platform: string;
  url: string;
  icon: string; // Lucide icon name
  isValid: boolean;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "Instagram",
    url: "https://instagram.com",
    icon: "Instagram",
    isValid: true,
  },
  {
    platform: "LinkedIn",
    url: "https://linkedin.com",
    icon: "Linkedin",
    isValid: true,
  },
  {
    platform: "YouTube",
    url: "https://youtube.com",
    icon: "Youtube",
    isValid: true,
  },
  {
    platform: "Twitter",
    url: "https://twitter.com",
    icon: "Twitter",
    isValid: true,
  },
];
