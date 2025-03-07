import {Router} from "express"
import {registeruser , loginuser , logoutuser} from  "../controller/user.control.js"
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



export default router 