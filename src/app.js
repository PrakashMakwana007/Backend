import express from 'express'; 
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();


app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}));

app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded())
app.use(cookieParser())


// routes import 

import userRoutes from "./routes/user.routs.js"
import videoRouter from "./routes/video.routs.js"
import playListRouter from "./routes/playlist.routs.js"
// routes del 

app.use("/api/v1/user",userRoutes)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/playlist",playListRouter)

export {app}