"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react"; // icon set from lucide-react (already in Next projects)

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supporter = localStorage.getItem("supporter");
    const creator = localStorage.getItem("creator");
    if (supporter || creator) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("supporter");
    localStorage.removeItem("creator");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <nav className="bg-blue-600 text-white flex items-center justify-between px-4 sm:px-8 py-3 shadow-md relative">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 bg-white rounded-full px-2 py-1">
        <img src="/logoo.gif" alt="Logo" height={40} width={40} />
        <span className="text-lg font-bold text-black">TipTap</span>
      </Link>

      {/* Desktop Logout */}
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="hidden sm:block text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-400 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Logout
        </button>
      )}

      {/* Mobile Menu Button */}
      <button
        className="sm:hidden focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-blue-600 flex flex-col items-center py-4 sm:hidden z-50">
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-400 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
            >
              Logout
            </button>
          )}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-white text-base font-medium py-1"
          >
            Home
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
