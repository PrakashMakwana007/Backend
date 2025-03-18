import React from "react";


const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 h-26 bg-gray-900 text-white shadow-md">
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="VideoTube" className="h-8" />
      </div>
      <div className="flex items-center justify-center flex-grow max-w-xs">
        <input
          type="text"
          placeholder="Search"
          className="w-64 px-3 py-1 h-10 w-4xs rounded-md bg-white text-black focus:outline-none text-sm"
        />
      </div>
      <div className="flex items-center gap-4">
       <button className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-blue-500" >   My Account</button>
        <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-500">Login</button>
        <button className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-500">Logout</button>
      </div>
    </header>
  );
};

export default Header;
