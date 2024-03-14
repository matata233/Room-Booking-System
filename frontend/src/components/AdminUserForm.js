import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import PageTheme from "./PageTheme";
import dummyBuildings from "../dummyData/dummyBuildings";
import AutoDropdown from "./AutoDropdown";
import ToggleBuilding from "./ToggleBuilding";
import AddBuilding from "./AddBuilding";
import { useGetBuildingsQuery } from "../slices/buildingsApiSlice";
import MoreInfo from "./MoreInfo";
import { toast } from "react-toastify";

const AdminUserForm = ({
  firstlyHeader,
  secondaryHeader,
  buttonText,
  handleSubmit,
  initialValues = {},
}) => {
  const { data: buildings, error, isLoading, refetch } = useGetBuildingsQuery();

  //  const [extBuilding, setExtBuilding] = useState(true);
  const [building, setBuilding] = useState(null);
  const [buildingId, setBuildingId] = useState(null);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [floor, setFloor] = useState(null);
  const [desk, setDesk] = useState(null);

  useEffect(() => {
    setBuildingId(building?.value);
  }, [building]);

  const validateUserData = (data) => {
    const errors = [];

    if (!Number.isInteger(data.floor) || data.floor <= 0) {
      errors.push("invalid floor number");
    }

    if (!Number.isInteger(data.desk) || data.desk <= 0) {
      errors.push("invalid desk number");
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      buildingId,
      username,
      firstName,
      lastName,
      email,
      floor: parseInt(floor),
      desk: parseInt(desk),
    };
    const validation = validateUserData(formData);
    if (validation.isValid) {
      handleSubmit(formData);
    } else {
      const validationErrors = validation.errors
        .map((error, index) => `${index + 1}. ${error}`)
        .join(" ; ");

      toast.error(`User data validation failed: ${validationErrors}`);
    }
  };

  return (
    <ThemeProvider theme={PageTheme}>
      <div className="flex  flex-col items-center justify-center font-amazon-ember">
        <div className="group relative  pl-3">
          <div className="absolute inset-0 transform rounded-3xl bg-gradient-to-br from-orange-300 to-theme-orange shadow-lg duration-300 group-hover:-rotate-3 sm:group-hover:-rotate-6"></div>
          <form
            onSubmit={onSubmit}
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
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
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
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
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
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
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
                                value: building.buildingId,
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
                  value={floor}
                  onChange={(event) => setFloor(event.target.value)}
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
                  value={desk}
                  onChange={(event) => setDesk(event.target.value)}
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AdminUserForm;
