import { Router } from "express";
import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus
} from "../controller/video.control.js";

import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.middle.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
  .get(getAllVideos)
  .post(
    upload.fields([
      { name: "videoFile", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 }
    ]),
    publishAVideo
  );

router.route("/:videoId").get(getVideoById);
router.route("/:videoId").patch(upload.single("thumbnail"), updateVideo);
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
router.route("/:videoId").delete(deleteVideo);

export default router;