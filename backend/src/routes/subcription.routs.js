import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middle.js";
import { getsubscribedChannel, toogleSubcribe, userChanelsubscribe } 
from  "../controller/subcription.cntrol.js"
const router = Router();

// Middleware to protect routes
router.use(verifyJWT);

router
    .route("/c/:channelId")
    .get(userChanelsubscribe)
    .post(toogleSubcribe);

router.route("/u/:subscriberId").get(getsubscribedChannel);

export default router;
