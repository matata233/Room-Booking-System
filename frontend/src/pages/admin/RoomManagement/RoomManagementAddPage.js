import React from "react";
import AdminInputForm from "../../../components/AdminInputForm";

const RoomManagementAddPage = () => {
  const firstlyHeader = "Room Management";
  const secondaryHeader = "Add Room";
  const labels = ['Room No.','Room Location','Capacity'];
  const buttonText = "Add New Room";

  return (
    <AdminInputForm firstlyHeader={firstlyHeader} secondaryHeader={secondaryHeader} labels={labels} buttonText={buttonText}/>
  );
};

export default RoomManagementAddPage;
