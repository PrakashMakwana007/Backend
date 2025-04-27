import { Router } from "express"; 
import { verifyJWT } from "../middlewares/auth.middle.js";
import { getChanelVideo,
         getchanelStat
}
 from "../controller/dashbord.control.js"


 const router = Router()
  

 router.use(verifyJWT)

 router.route("/stats/:chanelId").get(getchanelStat)
 router.route("/videos/:chanelId").get(getChanelVideo)
 
 

export default router