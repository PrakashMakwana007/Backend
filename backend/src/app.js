import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://videotube-omega.vercel.app', // ✅ production domain
  'https://videotube-git-main-makwana-prakashs-projects.vercel.app',
  'https://videotube-3ex1fbzz6-makwana-prakashs-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route imports
import userRoutes from "./routes/user.routs.js";
import videoRouter from "./routes/video.routs.js";
import playListRouter from "./routes/playlist.routs.js";
import commentRouter from "./routes/comment.routs.js";
import likeRouter from "./routes/like.routs.js";
import subscribRouts from "./routes/subcription.routs.js";
import dashbordRouts from "./routes/dashbord.routs.js";

// Mount routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/playlist", playListRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/subscriptions", subscribRouts);
app.use("/api/v1/dashbord", dashbordRouts);

export { app };
