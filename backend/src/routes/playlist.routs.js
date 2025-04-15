import { Router } from "express";
import {
       createPlaylist,
       getPlaylistById,
       getUserPlaylist,
       removeVideo,
       addVideo,
       updatePlaylist,
       deletePlaylist
}
from "../controller/palylist.control.js"
import { verifyJWT } from "../middlewares/auth.middle.js";




const router = Router()


router.use(verifyJWT)

router.route("/").post(createPlaylist)
  
router.route("/user/:userId").get(getUserPlaylist)
router.route("/:playlistId").get(getPlaylistById)
router.route("/add/:videoId/:playlistId").patch(addVideo)
router.route("/:playlistId").patch(updatePlaylist)
router.route("/remove/:videoId/:playlistId").patch(removeVideo);
router.route("/:playlistId").delete(deletePlaylist);

export default router