import { Router } from "express"; 
import { verifyJWT } from "../middlewares/auth.middle.js";
import { getChanelVideo,
         getchanelStat
}
 from "../controller/dashbord.control.js"


 const router = Router()
  

 router.use(verifyJWT)

 router.route("/stats").get(getchanelStat)
 router.route("/Videos").get(getChanelVideo)
 