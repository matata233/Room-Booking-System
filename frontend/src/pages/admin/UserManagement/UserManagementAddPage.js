import React from "react";
import AdminUserForm from "../../../components/AdminUserForm";

const UserManagementAddPage = () => {
  const firstlyHeader = "User Management";
  const secondaryHeader = "Add User";
  const buttonText = "Add New User";

  return (
    <AdminUserForm
      firstlyHeader={firstlyHeader}
      secondaryHeader={secondaryHeader}
      buttonText={buttonText}
    />
  );
};

export default UserManagementAddPage;
