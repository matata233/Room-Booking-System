import RoomMngtSVG from "../../../assets/room-mngt.svg";
import UserMngtSVG from "../../../assets/user-mngt.svg";
import RoomIconSVG from "../../../assets/room-icon.svg";
import UserIconSVG from "../../../assets/user-icon.svg";

function AdminHomePage() {
  return (
    <div className="flex h-auto w-screen flex-col items-center justify-center md:h-[80vh]">
      <h1 className="mx-10 mt-24 text-4xl sm:mt-48 sm:text-5xl lg:text-6xl">
        Booking Administration System
      </h1>
      <div className="my-6 hidden flex-col gap-4 sm:flex">
        <div className="mx-10 flex flex-row items-center">
          <div className="min-w-16">
            <img src={RoomIconSVG} alt="Room Mngt Icon" className="h-10 w-16" />
          </div>
          <p className="mx-10 w-auto md:w-[550px] lg:w-[770px]">
            Room Management allows the you to add/change/delete rooms into the
            system and record various features of the room.
          </p>
        </div>
        <div className="mx-10 flex flex-row items-center">
          <div className="min-w-16">
            <img src={UserIconSVG} alt="User Mngt Icon" className="h-10 w-16" />
          </div>
          <p className="mx-10 w-auto md:w-[550px] lg:w-[775px]">
            Staff Management allows you to import and input user information (up
            to 1000 users) into the profile database and to perform
            change/delete staff information.
          </p>
        </div>
      </div>
      <div className="my-5 flex flex-col gap-5 md:flex-row md:gap-8">
        <div className="mx-10 flex w-auto flex-col items-center bg-white px-5 py-5 shadow-2xl transition-all duration-300 hover:translate-y-2 hover:shadow-2xl md:mx-0 md:w-8/12 md:px-9">
          <img
            className="h-40 object-cover md:h-60"
            alt="Meeting Room"
            src={RoomMngtSVG}
          />
          <h2 className="p-3 text-2xl">Room Management</h2>
          <div className="m-5">
            <button
              type="button"
              href="#"
              class="rounded bg-theme-orange px-8 py-0.5 text-black hover:bg-theme-dark-orange"
            >
              Go
            </button>
          </div>
        </div>
        <div className="mx-10 flex w-auto flex-col items-center bg-white px-5 py-5 shadow-2xl transition-all duration-300 hover:translate-y-2 hover:shadow-2xl md:mx-0 md:w-8/12 md:px-9">
          <img
            className="h-40 object-cover md:h-60"
            alt="Meeting Room"
            src={UserMngtSVG}
          />
          <h2 className="p-3 text-2xl">User Management</h2>
          <div className="m-5">
            <button
              type="button"
              href="#"
              class="rounded bg-theme-orange px-8 py-0.5 text-black hover:bg-theme-dark-orange"
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHomePage;
