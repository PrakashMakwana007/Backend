import {Router} from "express"
import {registeruser , 
       loginuser ,
       logoutuser ,
       refreshAccesstoken,
       changePassword,
       getCurrntuser,
       updateAvatar,
       updateCoverimage,
       chanelprofile,
       watchHistory
       }
        from  "../controller/user.control.js"
import { verifyJWT } from "../middlewares/auth.middle.js"
import { upload } from "../middlewares/multer.js"


const router = Router()

 router.route("/register").post(
    upload.fields([
        {
            name :"avatar",
            maxCount:1
        },
        {
            name : "coverImage",
            maxCount:1
        }
    ]),
    registeruser

)
router.route("/login").post(loginuser)

//secored route
router.route("/logout").post(verifyJWT, logoutuser)
router.route("/refresh-token").post(refreshAccesstoken)
router.route("/chanje-password").post(verifyJWT,changePassword)
router.route("/getCurrentuser").get(verifyJWT,getCurrntuser)
router.route("/updateAvatar").post(verifyJWT,upload.single("avatar"),updateAvatar)
router.route("/updateCoverimage").post(verifyJWT,upload.single("coverImage"),updateCoverimage)
router.route("/chanel-profile").post(verifyJWT,chanelprofile)
router.route("/watchHistory").get(verifyJWT,watchHistory)


export default router 