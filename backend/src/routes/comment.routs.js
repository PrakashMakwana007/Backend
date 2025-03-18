import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middle.js";
import {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
} from "../controller/comment.control.js";

const router = Router();

router.use(verifyJWT);

router.route("/:videoId/comments").get(getVideoComments);
router.route("/:videoId/comments").post(addComment);
router.route("/comment/:commentId").patch(updateComment);
router.route("/comment/:commentId").delete(deleteComment);

export default router;
