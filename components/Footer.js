import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-6 mt-8 flex flex-col items-center text-center px-4 space-y-4">
      {/* Brand Title */}
      <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-2 space-y-2 sm:space-y-0">
        <h1 className="text-3xl sm:text-4xl font-bold">TipTap</h1>
        <span className="text-xl sm:text-2xl font-semibold">
          – Your Tap, Their Dream !!
        </span>
      </div>

      {/* Tagline */}
      <div className="text-lg sm:text-xl">
        Your Support Makes Ideas Happen
      </div>

      {/* Contact Section */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base">
        <h1 className="text-base sm:text-lg font-medium">Contact Us:</h1>
        <span>📞 +91 8437142580</span>
        <span>✉ harshh.2901@gmail.com</span>
      </div>

      {/* Copyright */}
      <div className="text-xs sm:text-sm text-white">
        © {new Date().getFullYear()} TipTap. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
