import dotenv from "dotenv";
import { app } from "./app.js";
import path from "path";
import connectDB from "./db/index.js";


dotenv.config({ path: path.resolve(process.cwd(), ".env") });

console.log("🌍 Starting server...");

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
