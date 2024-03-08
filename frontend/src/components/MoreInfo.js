import React from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { IconButton, Tooltip } from "@mui/material";

const MoreInfo = ({ info }) => {
  return (
    <Tooltip title={info}>
      <IconButton>
        <IoInformationCircleOutline />
      </IconButton>
    </Tooltip>
  );
};

export default MoreInfo;
