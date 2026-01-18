import { ProcessStep, Reel } from './types';

export const HERO_COPY = "I cut scenes that keep eyes on-screen.";

export const REELS: Reel[] = [
  {
    id: 'r1',
    title: 'Fashion Week',
    client: 'Vogue',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-fashion-model-posing-40089-large.mp4', 
    posterUrl: 'https://picsum.photos/id/338/450/800', 
    duration: '0:15',
    tags: ['Fashion', 'Fast Paced']
  },
  {
    id: 'r2',
    title: 'Night Life',
    client: 'Club X',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-crowd-cheering-in-a-club-at-night-40417-large.mp4', 
    posterUrl: 'https://picsum.photos/id/453/450/800',
    duration: '0:30',
    tags: ['Event', 'Vibe']
  },
  {
    id: 'r3',
    title: 'Travel Diary',
    client: 'Airbnb',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4', 
    posterUrl: 'https://picsum.photos/id/214/450/800',
    duration: '0:22',
    tags: ['Travel', 'Lifestyle']
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Gathering Assets',
    description: 'We collect your raw footage and brand files to get started.',
  },
  {
    step: '02',
    title: 'Script Check',
    description: 'I review and refine your script to make sure the message hits home.',
  },
  {
    step: '03',
    title: 'Storyboard',
    description: 'I map out the visuals so you can see the flow before I start editing.',
  },
  {
    step: '04',
    title: 'Plan Approval',
    description: 'You review the plan. We allow up to 2 rounds of changes to align on the vision.',
  },
  {
    step: '05',
    title: 'The Edit',
    description: 'I bring the story to life with precise cutting, sound, and color.',
  },
  {
    step: '06',
    title: 'Revisions',
    description: 'We polish the draft. Includes 2 rounds of feedback to get it perfect.',
  },
  {
    step: '07',
    title: 'Final Delivery',
    description: 'You get the high-quality video file, ready for your platform.',
  },
];

export const PRICING_PLANS = [
  {
    title: "Basic Video Editing",
    price: "₹9,999",
    period: "/ month",
    features: [
      "12–13 Short-form Videos",
      "Editing from Provided Script",
      "Platform-Optimized Exports",
      "Up to 2 Revisions per Video"
    ],
    highlight: false
  },
  {
    title: "Full Creative Editing",
    price: "₹14,999",
    period: "/ month",
    features: [
      "12–13 Short-form Videos",
      "Script Review & Refinement",
      "Storyboard & Pacing Strategy",
      "Performance-Focused Editing",
      "Up to 2 Revisions per Video"
    ],
    highlight: true
  }
];