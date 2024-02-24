import React from "react";
import AdminUserForm from "../../../components/AdminUserForm";
import FileUpload from "../../../components/FileUpload";

const UserManagementAddPage = () => {
  const firstlyHeader = "User Management";
  const secondaryHeader = "Add User";
  const buttonText = "Add New User";

  return (
    <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:justify-between">
      <div className="basis-1/2">
        <AdminUserForm
          firstlyHeader={firstlyHeader}
          secondaryHeader={secondaryHeader}
          buttonText={buttonText}
        />
      </div>

      <div className="relative hidden items-center justify-center lg:flex">
        <div className="absolute h-full  border-l-2 border-dashed border-theme-orange"></div>
        <span className="z-10 bg-white px-2 text-sm text-theme-orange">OR</span>
      </div>

      <div className="relative flex w-full  items-center justify-center lg:hidden">
        <div className="absolute w-full border-t-2 border-dashed border-theme-orange"></div>
        <span className="z-10 bg-white px-2 text-sm text-theme-orange">OR</span>
      </div>
      <FileUpload />
    </div>
  );
};

export default UserManagementAddPage;
