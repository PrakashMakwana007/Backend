import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 min-h-screen p-4">
      <nav className="space-y-4">
        <Link to="/" className="block text-lg font-bold text-cyan-400 hover:text-white">Home</Link>
        <Link to="/upload" className="block text-lg text-gray-300 hover:text-white">Upload Video</Link>
        <Link to="/playlist" className="block text-lg text-gray-300 hover:text-white">Playlists</Link>
        <Link to="/liked-videos" className="block text-lg text-gray-300 hover:text-white">Liked Videos</Link>
        <Link to="/subscriptions" className="block text-lg text-gray-300 hover:text-white">Subscriptions</Link>
        <Link to="/my-channel" className="block text-lg text-gray-300 hover:text-white">My Channel</Link>
        <Link to="/history" className="block text-lg text-gray-300 hover:text-white">Watch History</Link>
        <Link to="/dashboard" className="block text-lg text-gray-300 hover:text-white">Dashboard</Link>
       
      </nav>
    </aside>
  );
};

export default Sidebar;
