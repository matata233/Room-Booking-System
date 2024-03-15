import React, { useState } from "react";
import { TextField } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import PageTheme from "./PageTheme";
import dummyBuildings from "../dummyData/dummyBuildings";
import AutoDropdown from "./AutoDropdown";
import ToggleBuilding from "./ToggleBuilding";
import AddBuilding from "./AddBuilding";
import { useGetBuildingsQuery } from "../slices/buildingsApiSlice";
import MoreInfo from "./MoreInfo";
import { Link } from "react-router-dom";

const AdminUserForm = ({ firstlyHeader, secondaryHeader, buttonText }) => {
  const { data: buildings, error, isLoading, refetch } = useGetBuildingsQuery();

  //  const [extBuilding, setExtBuilding] = useState(true);
  const [building, setBuilding] = useState(null);

  const [cityId, setCityId] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [lon, setLon] = useState("");
  const [lat, setLat] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
  };

  return (
    <ThemeProvider theme={PageTheme}>
      <div className="flex  flex-col items-center justify-center font-amazon-ember">
        <div className="group relative  pl-3">
          <div className="absolute inset-0 transform rounded-3xl bg-gradient-to-br from-orange-300 to-theme-orange shadow-lg duration-300 group-hover:-rotate-3 sm:group-hover:-rotate-6"></div>
          <form
            onSubmit={handleSubmit}
            className="relative flex-col rounded-3xl bg-white p-4 shadow-lg sm:p-10"
          >
            <h1 className="px-10 text-center text-xl text-theme-dark-blue sm:px-20 md:px-32 md:text-2xl">
              {firstlyHeader}
            </h1>
            <h1 className="px-10 text-center text-sm text-gray-600  sm:px-20 md:px-32 md:text-base">
              {secondaryHeader}
            </h1>

            {/* text field */}
            <div className="space-y-4 py-8 text-sm text-gray-700">
              <div className="relative">
                <div className="flex justify-between gap-x-8">
                  <TextField
                    id="firstName"
                    label="First Name"
                    size="small"
                    required
                    variant="standard"
                    className="w-full"
                    InputLabelProps={{
                      className: "text-sm md:text-base font-amazon-ember",
                    }}
                    inputProps={{
                      className: "text-sm md:text-base font-amazon-ember",
                    }}
                  />

                  <TextField
                    id="lastName"
                    label="Last Name"
                    size="small"
                    required
                    variant="standard"
                    className="w-full"
                    InputLabelProps={{
                      className: "text-sm md:text-base font-amazon-ember",
                    }}
                    inputProps={{
                      className: "text-sm md:text-base font-amazon-ember",
                    }}
                  />
                </div>
              </div>

              <div className="relative">
                <TextField
                  id="email"
                  label="Email"
                  size="small"
                  type="email"
                  required
                  variant="standard"
                  className="w-full"
                  InputLabelProps={{
                    className: "text-sm md:text-base font-amazon-ember",
                  }}
                  inputProps={{
                    className: "text-sm md:text-base font-amazon-ember",
                  }}
                />
              </div>
              <div className="relative">
                <TextField
                  id="username"
                  label="Username"
                  size="small"
                  type="text"
                  required
                  variant="standard"
                  className="w-full"
                  InputLabelProps={{
                    className: "text-sm md:text-base font-amazon-ember",
                  }}
                  inputProps={{
                    className: "text-sm md:text-base font-amazon-ember",
                  }}
                />
              </div>

              {/* Toggle Existing/New building */}
              {/* <ToggleBuilding
                extBuilding={extBuilding}
                setExtBuilding={setExtBuilding}
                setBuilding={setBuilding}
              /> */}

              <div className="relative">
                <div className="flex justify-between">
                  {/* Autocomplete */}
                  <div className="grow">
                    <AutoDropdown
                      label="Building"
                      options={
                        isLoading
                          ? [{ label: "Loading...", value: null }]
                          : error
                            ? [
                                {
                                  label: "Error fetching buildings",
                                  value: null,
                                },
                              ]
                            : buildings.result.map((building) => ({
                                label: `${building.city.cityId} ${building.code}`,
                                value: building.id,
                              }))
                      }
                      isLoading={isLoading}
                      error={error}
                      selectedValue={building}
                      setSelectedValue={setBuilding}
                      className="w-full"
                    />
                  </div>

                  <MoreInfo info={"Nearest airport code | Building number "} />
                </div>
              </div>
              {/* 
              <div className="relative">
                <AddBuilding
                  cityId={cityId}
                  setCityId={setCityId}
                  code={code}
                  setCode={setCode}
                  isActive={isActive}
                  setIsActive={setIsActive}
                  address={address}
                  setAddress={setAddress}
                  lon={lon}
                  setLon={setLon}
                  lat={lat}
                  setLat={setLat}
                />
              </div> */}
              <div className="relative flex justify-between gap-x-8 ">
                <TextField
                  id="floor"
                  label="Floor"
                  size="small"
                  required
                  variant="standard"
                  type="number"
                  className="w-full"
                  InputLabelProps={{
                    className: "text-sm md:text-base font-amazon-ember",
                  }}
                  inputProps={{
                    className: "text-sm md:text-base font-amazon-ember",
                  }}
                />
                <TextField
                  id="desk"
                  label="Desk"
                  size="small"
                  required
                  variant="standard"
                  type="number"
                  className="w-full"
                  InputLabelProps={{
                    className: "text-sm md:text-base font-amazon-ember",
                  }}
                  inputProps={{
                    className: "text-sm md:text-base font-amazon-ember",
                  }}
                />
              </div>

              <div className="relative">
                <button className="mr-4 cursor-pointer rounded-lg bg-theme-orange px-2 py-1 text-sm text-theme-dark-blue transition-colors duration-300 ease-in-out hover:bg-theme-dark-orange  hover:text-white md:px-4 md:py-2 md:text-base">
                  {buttonText}
                </button>
                <Link
                  to="/userManagementPage"
                  className="rounded-lg ml-4 bg-theme-dark-blue px-2 py-1.5 text-white font-amazon-ember text-sm transition-colors duration-300 ease-in-out hover:bg-theme-blue hover:text-white md:px-12 md:py-2.5 md:text-base"
                  >
                  Back
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AdminUserForm;
