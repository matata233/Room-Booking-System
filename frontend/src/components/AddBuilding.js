import React from "react";
import {
  TextField,
  Switch,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
const AddBuilding = ({
  cityId,
  setCityId,
  code,
  setCode,
  isActive,
  setIsActive,
  address,
  setAddress,
  lon,
  setLon,
  lat,
  setLat,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      <TextField
        label="City ID"
        value={cityId}
        size="small"
        variant="standard"
        onChange={(e) => setCityId(e.target.value)}
        InputLabelProps={{
          className: "text-sm md:text-base font-amazon-ember",
        }}
        inputProps={{
          className: "text-sm md:text-base font-amazon-ember",
        }}
      />
      <TextField
        label="Code"
        value={code}
        size="small"
        variant="standard"
        onChange={(e) => setCode(e.target.value)}
        type="number"
        InputLabelProps={{
          className: "text-sm md:text-base font-amazon-ember",
        }}
        inputProps={{
          className: "text-sm md:text-base font-amazon-ember",
        }}
      />

      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              name="isActive"
              color="primary"
            />
          }
          label={
            <Typography style={{ fontFamily: "AmazonEmber" }}>
              Active
            </Typography>
          }
        />
      </FormGroup>

      <TextField
        label="Address"
        value={address}
        size="small"
        variant="standard"
        onChange={(e) => setAddress(e.target.value)}
        InputLabelProps={{
          className: "text-sm md:text-base font-amazon-ember",
        }}
        inputProps={{
          className: "text-sm md:text-base font-amazon-ember",
        }}
      />

      <TextField
        label="Longitude"
        value={lon}
        size="small"
        variant="standard"
        onChange={(e) => setLon(e.target.value)}
        type="number"
        InputLabelProps={{
          className: "text-sm md:text-base font-amazon-ember",
        }}
        inputProps={{
          className: "text-sm md:text-base font-amazon-ember",
        }}
      />
      <TextField
        label="Latitude"
        value={lat}
        size="small"
        variant="standard"
        onChange={(e) => setLat(e.target.value)}
        type="number"
        InputLabelProps={{
          className: "text-sm md:text-base font-amazon-ember",
        }}
        inputProps={{
          className: "text-sm md:text-base font-amazon-ember",
        }}
      />
    </div>
  );
};

export default AddBuilding;
