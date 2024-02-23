import React, { useState } from "react";
import { TextField } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import PageTheme from "./PageTheme";
import dummyBuildings from "../dummyData/dummyBuildings";
import AutoDropdown from "./AutoDropdown";
import ToggleBuilding from "./ToggleBuilding";
import AddBuilding from "./AddBuilding";

const AdminRoomForm = ({ firstlyHeader, secondaryHeader, buttonText }) => {
  const [extBuilding, setExtBuilding] = useState(true);
  const [building, setBuilding] = useState(null);

  const [cityId, setCityId] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [lon, setLon] = useState("");
  const [lat, setLat] = useState("");
  const [isActive, setIsActive] = useState(true);

  const buildings = dummyBuildings;

  const buildingOptions = buildings.map((building) => {
    return `${building.city_id}${building.code} ${building.address} ${building.lon} ${building.lat}`;
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
  };
  const equipments = [
    { id: "AV", description: "Audio/Visual Equipment" },
    { id: "VC", description: "Video Conference Equipment" },
  ];

  return (
    <ThemeProvider theme={PageTheme}>
      <div className="flex  items-center justify-center font-amazon-ember">
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
                    id="name"
                    label="Room Name"
                    size="small"
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
                    id="seats"
                    label="Seats"
                    size="small"
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
              </div>

              {/* Toggle Existing/New building */}
              <ToggleBuilding
                extBuilding={extBuilding}
                setExtBuilding={setExtBuilding}
                setBuilding={setBuilding}
              />

              {/* Autocomplete */}
              <div className={`relative ${extBuilding ? "" : "hidden"}`}>
                <AutoDropdown
                  label="Building"
                  options={buildingOptions}
                  selectedValue={building}
                  setSelectedValue={setBuilding}
                  className="w-full"
                />
              </div>

              <div className={`relative ${extBuilding ? "hidden" : ""}`}>
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
              </div>
              <div className="relative flex justify-between gap-x-8 ">
                <TextField
                  id="floor"
                  label="Floor"
                  size="small"
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
                  id="code"
                  label="Room Code"
                  size="small"
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
              <div className="relative flex items-center justify-start gap-4">
                {equipments.map((item) => (
                  <div className="flex gap-x-4">
                    <label
                      className="relative flex cursor-pointer items-center rounded-full"
                      htmlFor={item.id}
                    >
                      <input
                        type="checkbox"
                        className="peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-200 transition-all  checked:border-theme-orange checked:bg-theme-orange "
                        id={item.id}
                      />
                      <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-theme-dark-blue opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          stroke="currentColor"
                          stroke-width="1"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </span>
                    </label>
                    <label
                      className="cursor-pointer select-none text-theme-dark-blue"
                      htmlFor={item.id}
                    >
                      {item.description}
                    </label>
                  </div>
                ))}
              </div>

              <div className="relative">
                <button className="mr-4 cursor-pointer rounded-lg bg-theme-orange px-2 py-1 font-amazon-ember text-sm text-theme-dark-blue transition-colors duration-300 ease-in-out hover:bg-theme-dark-orange hover:text-white  md:px-4 md:py-2 md:text-base">
                  {buttonText}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AdminRoomForm;
