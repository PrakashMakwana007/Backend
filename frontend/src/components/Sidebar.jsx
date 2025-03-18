import React from "react";
import { useState } from "react";


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
        className={`bg-gray-900 text-white h-screen p-4 ${open ? "w-60" : "w-16"} transition-all`}
      >
        <button onClick={() => setOpen(!open)} className="mb-4 focus:outline-none">
          
        </button>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="p-2 hover:bg-gray-800 cursor-pointer rounded-lg">
              {item}
            </li>
          ))}
        </ul>
      </aside>
    );
  };

  export default Sidebar