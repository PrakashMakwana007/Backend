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
router.route("/remove/:videoId/:palylistId").patch(removeVideo)
router.route("/:playlistId").patch(updatePlaylist)
router.route("/:playlistid").delete(deletePlaylist)

export default router