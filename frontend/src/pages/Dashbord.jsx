import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChannelStats, fetchChannelVideos } from "../store/dashbordSlice";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, videos, loading, error } = useSelector((state) => state.dashboard);
  const user = useSelector((state) => state.user.user); // Get logged-in user

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchChannelStats(user._id));
      dispatch(fetchChannelVideos(user._id));
    }
  }, [dispatch, user]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6">Dashboard</h2>

      {loading && <p className="text-center text-lg">Loading data...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Channel Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold">Total Videos</h3>
          <p className="text-2xl font-semibold">{stats.totalVideos || 0}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold">Total Views</h3>
          <p className="text-2xl font-semibold">{stats.totalViews || 0}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold">Subscribers</h3>
          <p className="text-2xl font-semibold">{stats.totalSuscriber || 0}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold">Total Likes</h3>
          <p className="text-2xl font-semibold">{stats.totalLike || 0}</p>
        </div>
      </div>

      {/* Channel Videos */}
      <h3 className="text-2xl font-bold text-cyan-400 mb-4">My Videos</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.length === 0 ? (
          <p className="text-center text-gray-400">No videos uploaded yet.</p>
        ) : (
          videos.map((video) => (
            <div key={video._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <Link to={`/video/${video._id}`}>
                <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover rounded-lg" />
                <h3 className="mt-2 text-lg font-semibold">{video.title}</h3>
                <p className="text-gray-400 text-sm">Views: {video.views}</p>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
