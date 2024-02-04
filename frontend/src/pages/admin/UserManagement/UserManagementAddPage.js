import React from "react";
import AdminInputForm from "../../../components/AdminInputForm";

const UserManagementAddPage = () => {
  const firstlyHeader = "User Management";
  const secondaryHeader = "Add User";
  const labels = ['First Name','Last Name','Email','Location'];
  const buttonText = "Add New User";

  return (
    <AdminInputForm firstlyHeader={firstlyHeader} secondaryHeader={secondaryHeader} labels={labels} buttonText={buttonText}/>
  );
};

export default UserManagementAddPage;
