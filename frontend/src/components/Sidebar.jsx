import React, { useState } from "react";
import { Menu } from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const menuItems = [
    "Home",
    "Liked Videos",
    "History",
    "Subscribed Channels",
    "My Channel",
  ];

  return (
    <aside
      className={`bg-gray-900 text-white h-screen p-4 ${open ? "w-64" : "w-20"} transition-all duration-300 flex flex-col`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="mb-4 flex items-center justify-center p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
      >
        <Menu size={24} />
      </button>
      <ul className="space-y-4">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-blue-600 transition-all text-lg font-semibold"
          >
            <span className={`${open ? "block" : "hidden"}`}>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
