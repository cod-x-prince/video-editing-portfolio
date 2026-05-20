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
    title: "Video 1",
    client: "Spec Edit — Brand Film",
    cloudinaryVideoPublicId: "video1_graded_et8bvm",
    cloudinaryPosterPublicId: "video1_graded_poster_jwegbk",
    previewTime: 34,
    duration: "0:57",
    tags: ["Spec Edit", "Brand Film"],
    niche: "Brand Film",
    description: "Built to show how intentional sound design boosts retention. Most edits cut to visuals—this one is cut to emotion.",
  },
  {
    id: "7",
    title: "Video 2",
    client: "Spec Edit — Talking Head",
    cloudinaryVideoPublicId: "khurana_final_video_tyxi0s",
    cloudinaryPosterPublicId: "khurana_final_poster_gnfram",
    previewTime: 22,
    duration: "0:33",
    tags: ["Spec Edit", "Talking Head"],
    niche: "Talking Head",
    description: "Created as a prospect piece. He watched it twice. The budget didn't align, but the edit made the value clear.",
  },
  {
    id: "1",
    title: "Video 3",
    client: "Spec Edit — Healthcare",
    cloudinaryVideoPublicId: "health_sector_x49luv",
    previewTime: 3,
    duration: "0:30",
    tags: ["Spec Edit", "Healthcare"],
    niche: "Healthcare",
    description: "A self-initiated cut exploring how healthcare content can feel premium without feeling corporate.",
  },
  {
    id: "2",
    title: "Video 4",
    client: "Spec Edit — Interior Design",
    cloudinaryVideoPublicId: "home_interior_p8kyhy",
    previewTime: 2,
    duration: "0:30",
    tags: ["Spec Edit", "Interior Design"],
    niche: "Interior Design",
    description: "Pacing and grade designed to make each space feel intentional, not just scrollable.",
  },
  {
    id: "3",
    title: "Video 5",
    client: "Spec Edit — Property",
    cloudinaryVideoPublicId: "real_estate_wcupeb",
    previewTime: 2,
    duration: "0:30",
    tags: ["Spec Edit", "Property"],
    niche: "Property",
    description: "An experiment in pulling retention from pure b-roll using music choice and cut rhythm.",
  },
  {
    id: "5",
    title: "Video 6",
    client: "Spec Edit — Content Creator",
    cloudinaryVideoPublicId: "romanaEdit_dah0on",
    cloudinaryPosterPublicId: "romanaEdit_poster_rinvug",
    previewTime: 1.0, // 30th frame at 30fps
    duration: "0:30",
    tags: ["Spec Edit", "Content Creator"],
    niche: "Content Creator",
    description: "He didn't ask for this style. He saw it and loved it. Sometimes the edit reveals what the creator didn't know they wanted.",
  },
  {
    id: "4",
    title: "Video 7",
    client: "Spec Edit — Finance",
    cloudinaryVideoPublicId: "trading_reel_gdjmmc",
    previewTime: 2,
    duration: "0:30",
    tags: ["Spec Edit", "Finance"],
    niche: "Finance",
    description: "A trial cut focused on making finance content feel urgent without becoming overly salesy.",
  },
];

export const reels: Reel[] = reelSources.map((reel) => ({
  ...reel,
  cloudVideoUrl: buildCloudinaryVideoUrl(reel.cloudinaryVideoPublicId),
  cloudPosterUrl: buildCloudinaryPosterUrl(reel),
}));
