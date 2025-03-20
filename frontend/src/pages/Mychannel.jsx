import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, updateAvatar, updateCoverImage } from "../store/userSlice";

const MyChannel = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleCoverChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  const handleUpdateAvatar = () => {
    if (avatarFile) {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      dispatch(updateAvatar(formData));
    }
  };

  const handleUpdateCover = () => {
    if (coverFile) {
      const formData = new FormData();
      formData.append("coverImage", coverFile);
      dispatch(updateCoverImage(formData));
    }
  };

  if (loading) return <p className="text-center text-lg text-gray-400">Loading channel...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!user) return <p className="text-center text-gray-500">User not found</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Cover Image */}
      <div className="relative w-full h-48 bg-gray-800 rounded-lg" style={{ backgroundImage: `url(${user.coverImage})`, backgroundSize: 'cover' }}>
        <input type="file" onChange={handleCoverChange} className="absolute top-2 right-2 bg-white text-black p-1 rounded-md" />
        <button onClick={handleUpdateCover} className="absolute top-10 right-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition">
          Update Cover
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex items-center mt-6 space-x-4">
        <div className="relative">
          <img src={user.avatar} alt={user.username} className="w-20 h-20 rounded-full border-4 border-cyan-400" />
          <input type="file" onChange={handleAvatarChange} className="absolute bottom-0 left-0 bg-white text-black p-1 rounded-md" />
          <button onClick={handleUpdateAvatar} className="absolute bottom-0 right-0 bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition">
            Update
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <p className="text-gray-400">{user.subscriberCount} subscribers</p>
        </div>
      </div>
    </div>
  );
};

export default MyChannel;
