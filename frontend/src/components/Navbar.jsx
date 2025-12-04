import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate('/');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="shadow bg-white">
      <nav className="w-full">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-9 h-9 sm:w-10 sm:h-10"
            />
            <span className="text-xl sm:text-2xl font-bold leading-none">
              resume
            </span>
          </Link>

          {/* Right side: user + logout */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            <button
              onClick={logoutUser}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base px-4 sm:px-5 py-1.5 sm:py-2 rounded-full cursor-pointer transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
