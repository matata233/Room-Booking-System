import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import PageTheme from "./PageTheme";
import AutoDropdown from "./AutoDropdown";
import ToggleBuilding from "./ToggleBuilding";
import AddBuilding from "./AddBuilding";
import { useGetBuildingsQuery } from "../slices/buildingsApiSlice";
import MoreInfo from "./MoreInfo";
import { toast } from "react-toastify";

const AdminRoomForm = ({
  firstlyHeader,
  secondaryHeader,
  buttonText,
  handleSubmit,
  initialValues = {},
}) => {
  const { data: buildings, error, isLoading, refetch } = useGetBuildingsQuery();

  // const [extBuilding, setExtBuilding] = useState(true);
  const [building, setBuilding] = useState(null);
  const [buildingId, setBuildingId] = useState(0);
  const [floorNumber, setFloorNumber] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [equipmentIds, setEquipmentIds] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [numberOfSeats, setNumberOfSeats] = useState(null);

  const equipments = [
    { id: "AV", description: "Audio/Visual Equipment" },
    { id: "VC", description: "Video Conference Equipment" },
  ];

  useEffect(() => {
    setBuildingId(building?.value);
  }, [building]);

  const validateRoomData = (data) => {
    const errors = [];

    if (!Number.isInteger(data.floorNumber) || data.floorNumber <= 0) {
      errors.push("invalid floor number");
    }

    if (!Number.isInteger(data.numberOfSeats) || data.numberOfSeats <= 0) {
      errors.push("invalid capacity");
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = {
      buildingId,
      floorNumber: parseInt(floorNumber),
      roomCode,
      equipmentIds,
      roomName,
      numberOfSeats: parseInt(numberOfSeats),
      isActive: true,
    };
    const validation = validateRoomData(formData);
    if (validation.isValid) {
      handleSubmit(formData);
    } else {
      const validationErrors = validation.errors
        .map((error, index) => `${index + 1}. ${error}`)
        .join(" ; ");

      toast.error(`Room data validation failed: ${validationErrors}`);
    }
  };

  const handleEquipmentsChange = (event) => {
    const { id, checked } = event.target;
    setEquipmentIds((currentIds) => {
      if (checked) {
        return [...currentIds, id];
      } else {
        return currentIds.filter((equipmentId) => equipmentId !== id);
      }
    });
  };

  return (
    <ThemeProvider theme={PageTheme}>
      <div className="flex  items-center justify-center font-amazon-ember">
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
                    id="name"
                    label="Room Name"
                    size="small"
                    variant="standard"
                    className="w-full"
                    value={roomName}
                    onChange={(event) => setRoomName(event.target.value)}
                    InputLabelProps={{
                      className: "text-sm md:text-base font-amazon-ember",
                    }}
                    inputProps={{
                      className: "text-sm md:text-base font-amazon-ember",
                    }}
                  />

                  <TextField
                    id="capacity"
                    label="Capacity"
                    size="small"
                    required
                    variant="standard"
                    type="number"
                    className="w-full"
                    value={numberOfSeats}
                    onChange={(event) => setNumberOfSeats(event.target.value)}
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

              {/* <div className={`relative ${extBuilding ? "hidden" : ""}`}>
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
                  className="w-full flex-1"
                  value={floorNumber}
                  onChange={(event) => setFloorNumber(event.target.value)}
                  InputLabelProps={{
                    className: "text-sm md:text-base font-amazon-ember",
                  }}
                  inputProps={{
                    className: "text-sm md:text-base font-amazon-ember",
                  }}
                />

                <div className="flex flex-1 justify-between">
                  <TextField
                    id="code"
                    label="Room Code"
                    size="small"
                    required
                    variant="standard"
                    className="w-full"
                    value={roomCode}
                    onChange={(event) => setRoomCode(event.target.value)}
                    InputLabelProps={{
                      className: "text-sm md:text-base font-amazon-ember",
                    }}
                    inputProps={{
                      className: "text-sm md:text-base font-amazon-ember",
                    }}
                  />
                  <div className="flex-none">
                    <MoreInfo info={'Eg. "101"'} />
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-start gap-4">
                {equipments.map((item) => (
                  <div className="flex gap-x-4" key={item.id}>
                    <label
                      className="relative flex cursor-pointer items-center rounded-full"
                      htmlFor={item.id}
                    >
                      <input
                        type="checkbox"
                        className="peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-200 transition-all  checked:border-theme-orange checked:bg-theme-orange "
                        id={item.id}
                        onChange={handleEquipmentsChange}
                        checked={equipmentIds.includes(item.id)}
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
