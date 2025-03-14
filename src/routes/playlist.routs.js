import { Router } from "express";
import {
       cratePlaylist,
       getPlaylistById,
       getUserpalyList,
       addVideo,
       removeVideo,
       updatePlaylist,
       deletePlaylist
}
from "../controller/palylist.control.js"
import { verifyJWT } from "../middlewares/auth.middle.js";




const router = Router()


router.use(verifyJWT)

router.route("/").post(cratePlaylist)
  
router.route("/user/:userId").get(getUserpalyList)
router.route("/playlistId").get(getPlaylistById)
router.route("/add/:videoId/:playlistId").patch(addVideo)
router.route("/remove/:videoId/:palylistId").patch(removeVideo)
router.route("/playlistId").patch(updatePlaylist)
router.route("/playlistid").delete(deletePlaylist)

export default router