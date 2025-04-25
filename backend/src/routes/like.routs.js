import { verifyJWT } from "../middlewares/auth.middle.js";
import {getLikedvideo,
        commentLike,
        videoLike,
        getlikeStatus
} from "../controller/like.control.js"
import { Router } from "express";

const router = Router()

router.use(verifyJWT)


router.route("/toggle/v/:videoId").post(videoLike);
router.route("/toggle/c/:commentId").post(commentLike);
router.route("/videos").get(getLikedvideo);
router.route("/status/v/:videoId").get(getlikeStatus)

export default router 