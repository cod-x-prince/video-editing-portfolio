export interface SocialLink {
  platform: string;
  url: string;
  icon: string; // Lucide icon name
  isValid: boolean;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "Instagram",
    url: "https://www.instagram.com/edit_x_parmbeer?igsh=MTMxNHN6ejEwdmN0bg==",
    icon: "Instagram",
    isValid: true,
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/parmbeer-singh-672b62279?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    icon: "Linkedin",
    isValid: true,
  },
  {
    platform: "Twitter",
    url: "https://x.com/madeby_parmbeer",
    icon: "Twitter",
    isValid: true,
  },
];
