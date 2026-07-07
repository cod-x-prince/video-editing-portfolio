import { Reel, ReelSource } from "../types";

const CLOUDINARY_CLOUD_NAME = "dqbmflby5";
const CLOUDINARY_VIDEO_TRANSFORM = "f_auto,q_auto:good,vc_auto,w_540,c_limit";
const CLOUDINARY_POSTER_TRANSFORM = "f_auto,q_auto,w_540,h_960,c_fill,g_auto";

function buildCloudinaryAssetUrl(
  resourceType: "image" | "video",
  transform: string,
  publicId: string,
  extension?: string,
) {
  const suffix = extension ? `.${extension}` : "";
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/${transform}/${publicId}${suffix}`;
}

function buildCloudinaryVideoUrl(publicId: string) {
  return buildCloudinaryAssetUrl("video", CLOUDINARY_VIDEO_TRANSFORM, publicId);
}

function buildCloudinaryPosterUrl({
  cloudinaryPosterPublicId,
  cloudinaryVideoPublicId,
  previewTime = 0.001,
}: Pick<
  ReelSource,
  "cloudinaryPosterPublicId" | "cloudinaryVideoPublicId" | "previewTime"
>) {
  if (cloudinaryPosterPublicId) {
    return buildCloudinaryAssetUrl(
      "image",
      CLOUDINARY_POSTER_TRANSFORM,
      cloudinaryPosterPublicId,
    );
  }

  return buildCloudinaryAssetUrl(
    "video",
    `${CLOUDINARY_POSTER_TRANSFORM},so_${previewTime}`,
    cloudinaryVideoPublicId,
    "jpg",
  );
}

const reelSources: ReelSource[] = [
  {
    id: "6",
    title: "The Brand Film - Sound-Led Edit",
    client: "Spec Edit — Brand Film",
    cloudinaryVideoPublicId: "video1_graded_et8bvm",
    cloudinaryPosterPublicId: "video1_graded_poster_jwegbk",
    previewTime: 34,
    duration: "0:57",
    tags: ["Spec Edit", "Brand Film"],
    niche: "Brand Film",
    description:
      "Hook: emotion over visuals. Result: the edit leans on sound and pacing so the opening lands before the visuals do.",
  },
  {
    id: "7",
    title: "The Talking Head - Prospect Cut",
    client: "Spec Edit — Talking Head",
    cloudinaryVideoPublicId: "khurana_final_video_tyxi0s",
    cloudinaryPosterPublicId: "khurana_final_poster_gnfram",
    previewTime: 22,
    duration: "0:33",
    tags: ["Spec Edit", "Talking Head"],
    niche: "Talking Head",
    description:
      "Hook: a direct promise, trimmed to the point. Result: the structure is built to make a warm prospect keep watching.",
  },
  {
    id: "1",
    title: "The Healthcare Reel",
    client: "Spec Edit — Healthcare",
    cloudinaryVideoPublicId: "health_sector_x49luv",
    previewTime: 3,
    duration: "0:30",
    tags: ["Spec Edit", "Healthcare"],
    niche: "Healthcare",
    description:
      "Hook: premium without the corporate drag. Result: the pacing keeps the piece calm, clear, and easy to trust.",
  },
  {
    id: "2",
    title: "The Interior Design Reel",
    client: "Spec Edit — Interior Design",
    cloudinaryVideoPublicId: "home_interior_p8kyhy",
    previewTime: 2,
    duration: "0:30",
    tags: ["Spec Edit", "Interior Design"],
    niche: "Interior Design",
    description:
      "Hook: design details first, transitions second. Result: the grade and pacing make each space feel considered.",
  },
  {
    id: "3",
    title: "The Property Reel - B-Roll Retention",
    client: "Spec Edit — Property",
    cloudinaryVideoPublicId: "real_estate_wcupeb",
    previewTime: 2,
    duration: "0:30",
    tags: ["Spec Edit", "Property"],
    niche: "Property",
    description:
      "Hook: turn pure b-roll into a sequence with momentum. Result: the rhythm does the retention work instead of narration.",
  },
  {
    id: "5",
    title: "The Creator Edit - Style Discovery",
    client: "Spec Edit — Content Creator",
    cloudinaryVideoPublicId: "romanaEdit_dah0on",
    cloudinaryPosterPublicId: "romanaEdit_poster_rinvug",
    previewTime: 1.0, // 30th frame at 30fps
    duration: "0:30",
    tags: ["Spec Edit", "Content Creator"],
    niche: "Content Creator",
    description:
      "Hook: discovery over imitation. Result: the edit reveals a sharper style without asking the creator to become someone else.",
  },
  {
    id: "4",
    title: "The Finance Reel - Urgency Without Hype",
    client: "Spec Edit — Finance",
    cloudinaryVideoPublicId: "trading_reel_gdjmmc",
    previewTime: 2,
    duration: "0:30",
    tags: ["Spec Edit", "Finance"],
    niche: "Finance",
    description:
      "Hook: urgency without the usual noise. Result: the cut keeps the finance message clear, fast, and grounded.",
  },
];

export const reels: Reel[] = reelSources.map((reel) => ({
  ...reel,
  cloudVideoUrl: buildCloudinaryVideoUrl(reel.cloudinaryVideoPublicId),
  cloudPosterUrl: buildCloudinaryPosterUrl(reel),
}));
