import React from "react";
import { Link, useLocation } from "react-router-dom";

const AvatarDropdown = ({ handleLogout, toggleDropdown, isAdmin = true }) => {
  // Inside your component
  const location = useLocation();
  const isRoomManagementPage = location.pathname === "/roomManagementPage";
  const isUserManagementPage = location.pathname === "/userManagementPage";
  const isBookingPage = location.pathname === "/booking";

  return (
    <>
      {" "}
      <div className="py-1">
        <Link
          to={"/booking"}
          className={`block  px-4 py-2 text-sm   ${isBookingPage ? "cursor-not-allowed text-gray-300" : "text-gray-500  hover:text-theme-orange"}`}
          id="booking"
          onClick={toggleDropdown}
        >
          Book a Room
        </Link>
      </div>
      <div className={`py-1 ${isAdmin ? "" : "hidden"}`}>
        <Link
          to={"/userManagementPage"}
          className={`block  px-4 py-2 text-sm   ${isUserManagementPage ? "cursor-not-allowed text-gray-300" : "text-gray-500  hover:text-theme-orange"}`}
          id="user-management"
          onClick={toggleDropdown}
        >
          User Management
        </Link>
        <Link
          to={"/roomManagementPage"}
          className={`block  px-4 py-2 text-sm   ${isRoomManagementPage ? "cursor-not-allowed text-gray-300" : "text-gray-500  hover:text-theme-orange"}`}
          id="room-management"
          onClick={toggleDropdown}
        >
          Room Management
        </Link>
      </div>
      <div className="py-1">
        <div
          className="cursor-pointer px-4 py-2 text-sm  text-gray-500 hover:text-red-500"
          id="logout"
          onClick={handleLogout}
        >
          Log Out
        </div>
      </div>
    </>
  );
};

export default AvatarDropdown;
