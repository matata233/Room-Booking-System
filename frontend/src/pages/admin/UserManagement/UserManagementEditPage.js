import React from "react";
import AdminUserForm from "../../../components/AdminUserForm";

const UserManagementEditPage = () => {
  const firstlyHeader = "User Management";
  const secondaryHeader = "Edit User";
  const buttonText = "Complete";

  return (
    <AdminUserForm
      firstlyHeader={firstlyHeader}
      secondaryHeader={secondaryHeader}
      buttonText={buttonText}
    />
  );
};

export default UserManagementEditPage;
