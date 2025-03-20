import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Signup from "./pages/Singup";
import UploadVideo from "./pages/UplodeVideo";
import VideoPlayer from "./pages/VideoPlayer";
import Playlist from "./pages/Playlist";
import LikedVideos from "./pages/LikedVideos";
import Subscription from "./pages/Subscription";
import MyChannel from "./pages/MyChannel";
import WatchHistory from "./pages/WatchHistory";
import Dashboard from "./pages/Dashbord";
import Home from "./pages/Home";

const App = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-darkblue via-sky-700 to-sky-400 text-white flex">
        {/* ✅ Sidebar with Navigation Links */}
        <Sidebar />

        <div className="flex-1">
          <Header />
          <main className="p-6 bg-gradient-to-bl from-sky-900 to-darkblue min-h-[90vh] rounded-t-lg shadow-lg">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/video/:videoId" element={<VideoPlayer />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/upload" element={<UploadVideo />} />
              <Route path="/playlist" element={<Playlist />} />
              <Route path="/liked-videos" element={<LikedVideos />} />
              <Route path="/subscriptions" element={<Subscription />} />
              <Route path="/my-channel" element={<MyChannel />} />
              <Route path="/history" element={<WatchHistory />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
