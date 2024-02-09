import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { HiOutlineBars3, HiXMark } from "react-icons/hi2";
import { logout } from "../slices/authSlice";
import logo from "../assets/logo.png";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const handleClick = () => setShowMenu(!showMenu);
  const [showDropdown, setShowDropdown] = useState(false);

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

  return (
    <header className="fixed z-10 h-20 w-screen bg-white font-poppins drop-shadow-md">
      <div className="flex h-full w-full items-center justify-between px-6">
        <div className="flex items-center md:gap-20">
          <Link to="/" className="cursor-pointer">
            {" "}
            <img src={logo} alt="logo" className="w-10" />
          </Link>

          <ul className={userInfo ? "hidden md:flex md:gap-10" : "hidden"}>
            <Link to="/booking" className="cursor-pointer">
              <li>Booking Details</li>
            </Link>

            <Link to="/myFavourite" className="cursor-pointer">
              <li>My Favourite</li>
            </Link>
          </ul>
        </div>
        {userInfo ? (
          <div className="relative hidden  items-center justify-end md:flex">
            <div
              className="hidden cursor-pointer items-center justify-end gap-8 rounded p-2 text-center text-theme-orange hover:border-2 hover:border-theme-blue md:flex"
              onClick={toggleDropdown}
            >
              <div> {`Hi, ${userInfo.given_name}`}</div>
              <div className="h-10 w-10 overflow-hidden rounded-full">
                <img src={userInfo.picture} alt="google picture" />
              </div>
            </div>

            <div
              className={
                showDropdown
                  ? "absolute top-20 w-full cursor-pointer rounded border-gray-500 bg-white p-4"
                  : "hidden"
              }
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
        ) : (
          <div
            className="hidden cursor-pointer  pr-4 md:flex"
            onClick={() => {
              navigate("/login");
              setShowMenu(false);
              setShowDropdown(false);
            }}
          >
            Member Log In
          </div>
        )}

        <div className="cursor-pointer md:hidden" onClick={handleClick}>
          {showMenu ? (
            <HiXMark className="size-12 cursor-pointer" />
          ) : (
            <HiOutlineBars3 className="size-12" />
          )}
        </div>
      </div>

      <div
        className={
          showMenu
            ? "absolute w-full cursor-pointer flex-col items-center bg-white px-4 text-center md:hidden"
            : "hidden"
        }
      >
        {userInfo ? (
          <>
            <Link to="/booking" onClick={handleClick}>
              {" "}
              <div className="my-4 flex h-16 w-full cursor-pointer items-center justify-center bg-theme-dark-blue p-4 text-center text-white">
                Booking Details
              </div>
            </Link>
            <Link to="/myFavourite" onClick={handleClick}>
              {" "}
              <div className="my-4 flex h-16 w-full cursor-pointer items-center justify-center bg-theme-dark-blue p-4 text-center text-white">
                My Favourite
              </div>
            </Link>

            <div className="relative items-center justify-center">
              <div
                className="my-4 flex h-16 w-full cursor-pointer items-center justify-center gap-6 p-4 text-center text-theme-orange hover:border-2 hover:border-theme-blue md:flex"
                onClick={toggleDropdown}
              >
                <div> {`Hi, ${userInfo.given_name}`}</div>
                <div className="h-10 w-10 overflow-hidden rounded-full">
                  <img src={userInfo.picture} alt="google picture" />
                </div>
              </div>

              <div
                className={
                  showDropdown
                    ? "absolute top-24 w-full rounded border-gray-500 bg-white p-4"
                    : "hidden"
                }
                onClick={handleLogout}
              >
                Logout
              </div>
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
