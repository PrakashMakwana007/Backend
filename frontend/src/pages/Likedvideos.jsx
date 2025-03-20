import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLikedVideos } from "../store/likeSlice";
import { Link } from "react-router-dom";

const LikedVideos = () => {
  const dispatch = useDispatch();
  const { likedVideos, loading, error } = useSelector((state) => state.like);

  useEffect(() => {
    dispatch(fetchLikedVideos());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6">Liked Videos</h2>

      {loading && <p className="text-center text-lg">Loading liked videos...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {likedVideos.length === 0 ? (
          <p className="text-center text-gray-400">You haven't liked any videos yet.</p>
        ) : (
          likedVideos.map((video) => (
            <div key={video._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <Link to={`/video/${video._id}`}>
                <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover rounded-lg" />
                <h3 className="mt-2 text-lg font-semibold">{video.title}</h3>
                <p className="text-gray-400 text-sm">{video.views} views</p>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LikedVideos;
