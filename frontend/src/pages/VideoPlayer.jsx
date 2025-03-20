import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchVideoById } from "../store/videoSlice";
import { fetchChannelSubscribers, toggleSubscription } from "../store/subscriptionSlice";


// add soment  an  
const VideoPlayer = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const { currentVideo, loading, error } = useSelector((state) => state.video);
  const { subscribers } = useSelector((state) => state.subscription);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    dispatch(fetchVideoById(videoId));
  }, [dispatch, videoId]);

  useEffect(() => {
    if (currentVideo?.uploadedBy?._id) {
      dispatch(fetchChannelSubscribers(currentVideo.uploadedBy._id));
    }
  }, [dispatch, currentVideo]);

  const handleSubscribeToggle = () => {
    if (currentVideo?.uploadedBy?._id) {
      dispatch(toggleSubscription(currentVideo.uploadedBy._id));
      setIsSubscribed(!isSubscribed);
    }
  };

  if (loading) return <p className="text-center text-lg text-gray-400">Loading video...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!currentVideo) return <p className="text-center text-gray-500">Video not found</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-6">
      <div className="w-full max-w-5xl">
        {/* Video Player */}
        <video controls className="w-full rounded-lg shadow-lg">
          <source src={currentVideo.videoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Video Info */}
        <h2 className="mt-4 text-2xl font-bold">{currentVideo.title}</h2>
        <p className="text-gray-400">{currentVideo.views} views • {new Date(currentVideo.createdAt).toLocaleDateString()}</p>
        <p className="mt-2 text-gray-300">{currentVideo.description}</p>

        {/* Channel Info */}
        <div className="mt-6 flex items-center justify-between bg-gray-800 p-4 rounded-lg">
          <div>
            <h3 className="text-lg font-bold">{currentVideo.uploadedBy.username}</h3>
            <p className="text-gray-400">{subscribers.length} subscribers</p>
          </div>
          <button
            onClick={handleSubscribeToggle}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              isSubscribed ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubscribed ? "Unsubscribe" : "Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
