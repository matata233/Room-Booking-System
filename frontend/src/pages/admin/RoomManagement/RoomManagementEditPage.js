import React from "react";
import AdminRoomForm from "../../../components/AdminRoomForm";

const RoomManagementEditPage = () => {
  const firstlyHeader = "Room Management";
  const secondaryHeader = "Edit Room";
  const buttonText = "Complete";

  return (
    <AdminRoomForm
      firstlyHeader={firstlyHeader}
      secondaryHeader={secondaryHeader}
      buttonText={buttonText}
    />
  );
};

export default RoomManagementEditPage;
