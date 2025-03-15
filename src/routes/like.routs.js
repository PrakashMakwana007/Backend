import { verifyJWT } from "../middlewares/auth.middle";
import {getLikedvideo,
        commentLike,
        videoLike
} from "../controller/like.control.js"
import { Router } from "express";

const router = Router()

router.use(verifyJWT)


router.route("/toggle/v/:videoId").post(videoLike);
router.route("/toggle/c/:commentId").post(commentLike);
router.route("/videos").get(getLikedvideo);


export default router
