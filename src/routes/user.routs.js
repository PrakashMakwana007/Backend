import {Router} from "express"
import {registeruser , loginuser , logoutuser ,refreshAccesstoken
      , changePassword,getCurrntuser,
} from  "../controller/user.control.js"
import { upload } from "../middlewares/multer.js"
import { verifyJWT } from "../middlewares/auth.middle.js"

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
router.route("/getCurrentuser").post(verifyJWT,getCurrntuser)


export default router 