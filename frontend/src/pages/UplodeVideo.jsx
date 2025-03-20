import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadVideo } from "../store/videoSlice";
import { useNavigate } from "react-router-dom";

const UploadVideo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.video);

  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const handleChange = (e) => {
    setVideoData({ ...videoData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoData({ ...videoData, [e.target.name]: file });

    if (e.target.name === "thumbnail") {
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoData.videoFile) {
      alert("Please select a video file!");
      return;
    }

    const formData = new FormData();
    formData.append("title", videoData.title);
    formData.append("description", videoData.description);
    formData.append("videoFile", videoData.videoFile);
    if (videoData.thumbnail) {
      formData.append("thumbnail", videoData.thumbnail);
    }

    const result = await dispatch(uploadVideo(formData));
    if (uploadVideo.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-6">
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-cyan-400 mb-4">Upload Video</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter video title"
              value={videoData.title}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label className="block text-gray-300">Description</label>
            <textarea
              name="description"
              placeholder="Enter video description"
              value={videoData.description}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-300">Video File (Required)</label>
            <input
              type="file"
              name="videoFile"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300">Thumbnail (Optional)</label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none"
            />
            {thumbnailPreview && (
              <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-3 w-full h-40 object-cover rounded-md" />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-400 text-gray-900 py-2 rounded-md font-semibold hover:bg-cyan-300 transition duration-300"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;
