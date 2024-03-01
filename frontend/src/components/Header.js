import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { HiOutlineBars3, HiXMark } from "react-icons/hi2";
import { logout } from "../slices/authSlice";
import logo from "../assets/logo.png";
import Navbar from "./Navbar";
import { IoMdArrowDropdown } from "react-icons/io";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [popHeader, setPopHeader] = useState(false);

  const scrollHeader = () => {
    if (window.scrollY >= 20) {
      setPopHeader(true);
    } else {
      setPopHeader(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHeader);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("#avatar-dropdown")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleMenu = () => setShowMenu(!showMenu);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    try {
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const location = useLocation();
  const isRoomManagementPage = location.pathname === "/roomManagementPage";
  const isUserManagementPage = location.pathname === "/userManagementPage";
  const isBookingPage = location.pathname === "/booking";
  const isBookingHistoryPage = location.pathname === "/bookingHistory";

  return (
    <header
      className={`fixed z-20 h-20 w-full bg-white font-amazon-ember ${popHeader ? "drop-shadow-md" : showMenu ? "drop-shadow-md md:drop-shadow-none" : ""}`}
    >
      {/* Laptop */}
      <div className="flex h-full w-full items-center justify-between px-6">
        <div className="flex items-center md:gap-10 lg:gap-20">
          <Link to="/" className="cursor-pointer">
            {" "}
            <img src={logo} alt="logo" className="w-10" />
          </Link>

          {/* Navbar */}
          <ul
            className={
              userInfo
                ? "hidden md:flex md:gap-6 md:text-sm lg:text-base"
                : "hidden"
            }
          >
            <Link
              to="/booking"
              className={`${isBookingPage ? "text-theme-orange" : "hover:text-theme-orange"} cursor-pointer `}
            >
              <li>Book a Room</li>
            </Link>
            <Link
              to="/bookingHistory"
              className={`${isBookingHistoryPage ? "text-theme-orange" : "hover:text-theme-orange"} cursor-pointer `}
            >
              <li>Booking History</li>
            </Link>

            {userInfo && userInfo.role === "admin" && (
              <Link
                to="/userManagementPage"
                className={`${isUserManagementPage ? "text-theme-orange" : "hover:text-theme-orange"} cursor-pointer `}
              >
                <li>User Management</li>
              </Link>
            )}
            {userInfo && userInfo.role === "admin" && (
              <Link
                to="/roomManagementPage"
                className={`${isRoomManagementPage ? "text-theme-orange" : "hover:text-theme-orange"} cursor-pointer `}
              >
                <li>Room Management</li>
              </Link>
            )}
          </ul>
        </div>
        {userInfo ? (
          <div
            id="avatar-dropdown"
            className="relative hidden  items-center justify-end md:flex "
          >
            <div
              className="hidden cursor-pointer items-center justify-end  rounded p-2 text-center  text-theme-orange hover:border-2 hover:border-theme-blue md:flex"
              onClick={toggleDropdown}
            >
              <IoMdArrowDropdown className="size-4 lg:size-6" />
              <div className="mr-2 text-sm lg:mr-4 lg:text-base">{`Hi, ${userInfo.firstName}`}</div>
              <div className="size-8 overflow-hidden rounded-full lg:size-10">
                <img src={userInfo.avatar} alt="google picture" />
              </div>
            </div>

            <div
              className={
                showDropdown
                  ? "absolute right-0 top-16 z-20 w-40  divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                  : "hidden"
              }
            >
              <div className="py-1">
                <div
                  className="cursor-pointer px-4 py-2 text-sm  text-white hover:text-red-500 md:text-gray-500"
                  id="logout"
                  onClick={handleLogout}
                >
                  Log Out
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="mr-4 hidden cursor-pointer rounded-lg bg-theme-orange px-4 py-2 text-theme-dark-blue transition-colors duration-300  ease-in-out hover:bg-theme-dark-orange hover:text-white md:flex"
            onClick={() => {
              navigate("/login");
              setShowMenu(false);
              setShowDropdown(false);
            }}
          >
            Member Log In
          </div>
        )}

        <div className="cursor-pointer md:hidden" onClick={toggleMenu}>
          {showMenu ? (
            <HiXMark className="size-12 cursor-pointer" />
          ) : (
            <HiOutlineBars3 className="size-12" />
          )}
        </div>
      </div>

      {/* Mobile */}
      <div
        className={
          showMenu
            ? "absolute w-full  flex-col items-center bg-white px-4 text-center md:hidden"
            : "hidden"
        }
      >
        {userInfo ? (
          <>
            {/* <Link to="/bookingHistory" onClick={handleClick}>
              {" "}
              <div className="my-4 flex h-16 w-full cursor-pointer items-center justify-center bg-theme-dark-blue p-4 text-center text-white">
                Booking History
              </div>
            </Link>
            <Link to="/myFavourite" onClick={handleClick}>
              {" "}
              <div className="my-4 flex h-16 w-full cursor-pointer items-center justify-center bg-theme-dark-blue p-4 text-center text-white">
                My Favourite
              </div>
            </Link>
            <Link to="/userManagementPage" onClick={handleClick}>
              {" "}
              <div className="my-4 flex h-16 w-full cursor-pointer items-center justify-center bg-theme-dark-blue p-4 text-center text-white">
                User Management
              </div>
            </Link>
            <Link to="/roomManagementPage" onClick={handleClick}>
              {" "}
              <div className="my-4 flex h-16 w-full cursor-pointer items-center justify-center bg-theme-dark-blue p-4 text-center text-white">
                Room Management
              </div>
            </Link> */}

            <div className="w-full  divide-y divide-gray-100  bg-theme-dark-blue">
              <Navbar
                handleLogout={handleLogout}
                handleNavbarClick={toggleMenu}
                isAdmin={userInfo && userInfo.role === "admin"}
              />
            </div>

            <div
              id="avatar-dropdown"
              className="relative items-center justify-center "
            >
              <div className="my-4 flex h-16 w-full  items-center justify-center gap-6 p-4 text-center text-theme-orange md:flex">
                <div> {`Hi, ${userInfo.firstName}`}</div>
                <div className="h-10 w-10 overflow-hidden rounded-full">
                  <img src={userInfo.avatar} alt="google picture" />
                </div>
              </div>

              {/* <div
                className={
                  showDropdown
                    ? "absolute  top-24 z-20 w-full  divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                    : "hidden"
                }
              >
                <AvatarDropdown
                  handleLogout={handleLogout}
                  toggleDropdown={toggleDropdown}
                />
              </div> */}
            </div>
          </>
        ) : (
          <div
            className="my-4 flex h-16 w-full cursor-pointer items-center justify-center  bg-theme-dark-blue p-4 text-center text-white"
            onClick={() => {
              navigate("/login");
              setShowMenu(false);
              setShowDropdown(false);
            }}
          >
            Member Log In
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
