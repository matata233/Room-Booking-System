import React from "react";
import AdminInputForm from "../../../components/AdminInputForm";

const UserManagementEditPage = () => {
  const firstlyHeader = "User Management";
  const secondaryHeader = "Edit User";
  const labels = ["First Name", "Last Name", "Email", "Phone", "Location"];
  const buttonText = "Complete";

  return (
    <div className="flex  w-full items-center justify-center">
      <AdminInputForm
        firstlyHeader={firstlyHeader}
        secondaryHeader={secondaryHeader}
        labels={labels}
        buttonText={buttonText}
      />
    </div>
  );
};

export default UserManagementEditPage;
