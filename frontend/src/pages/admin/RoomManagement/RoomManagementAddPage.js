import React from "react";
import AdminRoomForm from "../../../components/AdminRoomForm";

const RoomManagementAddPage = () => {
  const firstlyHeader = "Room Management";
  const secondaryHeader = "Add Room";
  const buttonText = "Add New Room";

  return (
    <AdminRoomForm
      firstlyHeader={firstlyHeader}
      secondaryHeader={secondaryHeader}
      buttonText={buttonText}
    />
  );
};

export default RoomManagementAddPage;
