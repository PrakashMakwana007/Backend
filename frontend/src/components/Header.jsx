import React from "react";

const Header = () => {
    return (
      <header className="flex items-center justify-between p-4 bg-gray-900 text-white">
        <div className="flex items-center gap-4">
          
          <h1 className="text-xl font-bold">VideoTube</h1>
        </div>
        <div className="flex-grow mx-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
          />
        </div>
       
      </header>
    );
  };

  export default Header