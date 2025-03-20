import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserPlaylists, createPlaylist, deletePlaylist } from "../store/palylistSlice";

const Playlist = () => {
  const dispatch = useDispatch();
  const { playlists, loading, error } = useSelector((state) => state.playlist);
  const [playlistData, setPlaylistData] = useState({ name: "", description: "" });

  useEffect(() => {
    dispatch(fetchUserPlaylists());
  }, [dispatch]);

  const handleChange = (e) => {
    setPlaylistData({ ...playlistData, [e.target.name]: e.target.value });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    dispatch(createNewPlaylist(playlistData));
    setPlaylistData({ name: "", description: "" });
  };

  const handleDelete = (playlistId) => {
    dispatch(deletePlaylist(playlistId));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6">My Playlists</h2>

      {/* Create Playlist Form */}
      <form onSubmit={handleCreate} className="mb-6 space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold">Create a Playlist</h3>
        <input
          type="text"
          name="name"
          placeholder="Playlist Name"
          value={playlistData.name}
          onChange={handleChange}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-cyan-400"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={playlistData.description}
          onChange={handleChange}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-cyan-400"
          required
        ></textarea>
        <button type="submit" className="w-full bg-cyan-400 text-gray-900 py-2 rounded-md font-semibold hover:bg-cyan-300 transition">
          Create Playlist
        </button>
      </form>

      {loading && <p className="text-center text-lg">Loading playlists...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Display Playlists */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <div key={playlist._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold">{playlist.name}</h3>
            <p className="text-gray-400">{playlist.description}</p>
            <button
              onClick={() => handleDelete(playlist._id)}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
