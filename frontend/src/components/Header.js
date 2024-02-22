import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { HiOutlineBars3, HiXMark } from "react-icons/hi2";
import { logout } from "../slices/authSlice";
import logo from "../assets/logo.png";
import AvatarDropdown from "./AvatarDropdown";

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

  const handleClick = () => setShowMenu(!showMenu);
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
    <header
      className={`fixed z-20 h-20 w-full bg-white font-amazon-ember ${popHeader ? "drop-shadow-md" : showMenu ? "drop-shadow-md" : ""}`}
    >
      <div className="flex h-full w-full items-center justify-between px-6">
        <div className="flex items-center md:gap-20">
          <Link to="/" className="cursor-pointer">
            {" "}
            <img src={logo} alt="logo" className="w-10" />
          </Link>

          <ul className={userInfo ? "hidden md:flex md:gap-6" : "hidden"}>
            <Link
              to="/booking"
              className="cursor-pointer hover:text-theme-orange"
            >
              <li>Booking Details</li>
            </Link>

            {/* <Link
              to="/myFavourite"
              className="cursor-pointer hover:text-theme-orange"
            >
              <li>My Favourite</li>
            </Link> */}
            <Link
              to="/userManagementPage"
              className="cursor-pointer hover:text-theme-orange"
            >
              <li>User Management</li>
            </Link>
            <Link
              to="/roomManagementPage"
              className="cursor-pointer hover:text-theme-orange"
            >
              <li>Room Management</li>
            </Link>
          </ul>
        </div>
        {userInfo ? (
          <div
            id="avatar-dropdown"
            className="relative hidden  items-center justify-end md:flex "
          >
            <div
              className="hidden cursor-pointer items-center justify-end gap-8 rounded p-2 text-center  text-theme-orange hover:border-2 hover:border-theme-blue md:flex"
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
                  ? "absolute right-0 top-16 z-20 w-40  divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                  : "hidden"
              }
            >
              <AvatarDropdown
                handleLogout={handleLogout}
                toggleDropdown={toggleDropdown}
              />
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
            {/* <Link to="/myFavourite" onClick={handleClick}>
              {" "}
              <div className="my-4 flex h-16 w-full cursor-pointer items-center justify-center bg-theme-dark-blue p-4 text-center text-white">
                My Favourite
              </div>
            </Link> */}
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
            </Link>

            <div
              id="avatar-dropdown"
              className="relative items-center justify-center "
            >
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
                    ? "absolute  top-24 z-20 w-full  divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                    : "hidden"
                }
              >
                <AvatarDropdown
                  handleLogout={handleLogout}
                  toggleDropdown={toggleDropdown}
                />
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
