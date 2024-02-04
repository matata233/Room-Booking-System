import React from "react";
import AdminInputForm from "../../../components/AdminInputForm";

const RoomManagementEditPage = () => {
  const firstlyHeader = "Room Management";
  const secondaryHeader = "Edit Room";
  const labels = ['Room No.','Room Location','Capacity'];
  const buttonText = "Complete";

  return (
    <AdminInputForm firstlyHeader={firstlyHeader} secondaryHeader={secondaryHeader} labels={labels} buttonText={buttonText}/>
  );
};

export default RoomManagementEditPage;
