import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function AutoDropdown({
  label,
  options,
  selectedValue,
  setSelectedValue,
  disable = false,
  defaultValue = null,
}) {
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={options}
      isOptionEqualToValue={(option, value) => option === value}
      getOptionDisabled={(option) => disable}
      onChange={(event, newValue) => {
        setSelectedValue(newValue);
      }}
      defaultValue={defaultValue}
      value={selectedValue}
      renderOption={(props, option, { selected }) => (
        <li
          {...props}
          className={` p-2 font-amazon-ember text-sm md:text-base ${selected ? "bg-theme-orange text-theme-dark-blue" : "bg-white text-black"}`}
        >
          {option}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          size="small"
          InputLabelProps={{
            ...params.InputLabelProps,
            className: `${params.InputLabelProps.className} text-sm md:text-base font-amazon-ember`,
          }}
          inputProps={{
            ...params.inputProps,
            className: `${params.inputProps.className} text-sm md:text-base font-amazon-ember`,
          }}
        />
      )}
    />
  );
}
