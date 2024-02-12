import React from "react";
import AdminInputForm from "../../../components/AdminInputForm";

const UserManagementAddPage = () => {
  const firstlyHeader = "User Management";
  const secondaryHeader = "Add User";
  const labels = ["First Name", "Last Name", "Email", "Location"];
  const buttonText = "Add New User";

  return (
    <div className="flex h-full w-full items-center justify-center">
      <AdminInputForm
        firstlyHeader={firstlyHeader}
        secondaryHeader={secondaryHeader}
        labels={labels}
        buttonText={buttonText}
      />
    </div>
  );
};

export default UserManagementAddPage;
