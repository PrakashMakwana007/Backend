import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchVideoById } from "../store/videoSlice";

const VideoDetail = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const { currentVideo, loading, error } = useSelector((state) => state.video);

  useEffect(() => {
    dispatch(fetchVideoById(videoId));
  }, [dispatch, videoId]);

  if (loading) return <p className="text-center text-lg">Loading video...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!currentVideo) return <p className="text-center text-gray-500">Video not found</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <video controls className="w-full rounded-lg shadow-lg">
          <source src={currentVideo.videoFile} type="video/mp4" />
        </video>
        <h2 className="mt-4 text-2xl font-bold">{currentVideo.title}</h2>
        <p className="text-gray-400">{currentVideo.views} views • {new Date(currentVideo.createdAt).toLocaleDateString()}</p>
        <p className="mt-2 text-gray-300">{currentVideo.description}</p>
      </div>
    </div>
  );
};

export default VideoDetail;
