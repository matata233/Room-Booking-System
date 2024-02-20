import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import useSearchData from "../../../hooks/useSearchData";
import usePaginateData from "../../../hooks/usePaginateData";
import useRowSelection from "../../../hooks/useRowSelection";
import useSortData from "../../../hooks/useSortData";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaSort } from "react-icons/fa6";
import { PiSelectionAllFill } from "react-icons/pi";
import dummyUsers from "../../../dummyData/dummyUsers";
import Pagination from "../../../components/Pagination";

const UserManagementPage = () => {
  const data = useMemo(() => dummyUsers, []);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { sortedData, sortBy } = useSortData(dummyUsers);
  const searchedData = useSearchData(sortedData, search, selectedCategory, [
    "avatar",
    "is_active",
    "user_id",
  ]);
  const displayedData = usePaginateData(searchedData, currentPage, rowsPerPage);

  const {
    selectedRows,
    setSelectedRows,
    toggleRowSelection,
    toggleAllSelection,
  } = useRowSelection(dummyUsers, "user_id");

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1); // reset to first page on search
  };

  return (
    <div className="container mx-auto flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2 sm:flex-row sm:justify-between">
        {/* Search Bar */}
        <div className="flex flex-grow gap-x-2 font-amazon-ember">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
            className="h-8  rounded-lg border-2 border-gray-200 p-2 text-xs md:h-10 md:w-1/3 md:text-base"
          />
          <div>
            <select
              className="h-8 rounded-lg border-2 border-gray-200  text-xs md:h-10  md:text-base"
              name="searchBy"
              id="searchBy"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All</option>
              <option value="email">Email</option>
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
            </select>
          </div>
        </div>

        {/* Add New User + Select All (mobile) + Delete Selected   */}
        <div className="flex justify-start gap-x-4 ">
          <Link
            to="/userManagementAddPage"
            className="flex h-8 cursor-pointer items-center rounded-lg bg-theme-orange px-4 py-2 font-amazon-ember text-sm text-theme-dark-blue transition-colors  duration-300 ease-in-out   md:h-10 md:text-base"
          >
            Add New User
          </Link>
          <a
            href="#"
            className={`flex h-8 w-8 items-center justify-center  rounded-lg border-2 border-theme-orange p-1.5 text-theme-orange transition-colors duration-300  ease-in-out md:hidden ${
              searchedData.length > 0 &&
              selectedRows.length === searchedData.length
                ? "bg-theme-orange text-white"
                : ""
            }`}
            onClick={(e) => {
              e.preventDefault(); // prevent the default anchor link behavior
              toggleAllSelection();
            }}
          >
            <PiSelectionAllFill />
          </a>

          <a
            href="#"
            className="flex h-8  w-8 items-center justify-center rounded-lg border-2 border-red-500 p-1.5 text-red-500 transition-colors duration-300 ease-in-out  md:h-10 md:w-16"
            onClick={() => {
              // pop up window to confirm delete
              // Delete the selected rows
              setSelectedRows([]);
            }}
          >
            <MdDelete />
          </a>
        </div>
      </div>

      {/* Data Table */}
      <div className="hidden  h-[calc(100vh-15rem)] overflow-x-auto rounded-lg shadow md:block">
        <table className="min-w-full divide-y">
          <thead className="sticky top-0 z-10 border-b-2 border-gray-200 bg-gray-50">
            <tr>
              <th className="p-3 text-left font-amazon-ember font-medium uppercase tracking-wider text-gray-500">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(searchedData.map((row) => row.user_id));
                    } else {
                      setSelectedRows([]);
                    }
                  }}
                  checked={
                    searchedData.length > 0 &&
                    selectedRows.length === searchedData.length
                  }
                  className="accent-theme-orange"
                />
              </th>
              {[
                { key: "email", display: "Email" },
                { key: "firstName", display: "First Name" },
                { key: "lastName", display: "Last Name" },
                { key: "role", display: "Role" },
              ].map((header) => (
                <th
                  key={header.key} // Use the key for React's key prop
                  onClick={() => sortBy(header.key)} // Use the key for sorting
                  className="cursor-pointer p-3 text-left font-amazon-ember text-base font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
                >
                  <div className="flex items-center gap-3">
                    {header.display} <FaSort />
                  </div>
                </th>
              ))}
              <th className="p-3 text-left font-amazon-ember text-base font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedData.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-md whitespace-nowrap p-3 text-center font-amazon-ember font-medium text-gray-900"
                >
                  No result
                </td>
              </tr>
            ) : (
              displayedData.map((row) => (
                <tr
                  key={row.user_id}
                  className={`font-amazon-ember hover:bg-theme-orange hover:bg-opacity-10 ${selectedRows.includes(row.user_id) ? "bg-theme-orange bg-opacity-10" : ""}`}
                  onClick={() => toggleRowSelection(row.user_id)}
                >
                  <td className="whitespace-nowrap p-3 text-sm text-gray-900">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.user_id)}
                      className="accent-theme-orange"
                    />
                  </td>
                  <td className="whitespace-nowrap p-3">
                    <div className="flex items-center">
                      <div className="relative h-8 w-8 flex-shrink-0">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={row.avatar}
                          alt="avatar"
                        />
                        {row.is_active && (
                          <>
                            <span className="absolute  right-0.5 top-1 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                            <span className="absolute  right-0.5 top-1 h-3 w-3 animate-ping rounded-full  bg-green-500"></span>
                          </>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {row.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap p-3 text-sm text-gray-500">
                    {row.firstName}
                  </td>
                  <td className="whitespace-nowrap p-3 text-sm text-gray-500">
                    {row.lastName}
                  </td>
                  <td className="whitespace-nowrap p-3">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${row.role === "ADMIN" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {row.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap p-3 text-right text-sm font-medium">
                    <div className="flex justify-start">
                      <a
                        href="#"
                        className="mr-6 text-indigo-600 hover:text-indigo-900"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaEdit className="size-6" />
                      </a>
                      <a
                        href="#"
                        className="text-red-600 hover:text-red-900"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MdDelete className="size-6" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* mobile */}
      <div className="grid h-[calc(100vh-15rem)] grid-cols-1 gap-4 overflow-x-auto rounded-lg border-y-2 sm:grid-cols-2 md:hidden ">
        {displayedData.length === 0 ? (
          <div className="col-span-1 flex h-full items-center justify-center sm:col-span-2">
            <div className="text-md whitespace-nowrap p-3 font-amazon-ember font-medium text-gray-900">
              No result
            </div>
          </div>
        ) : (
          displayedData.map((row) => (
            <div
              key={row.user_id}
              className={`max-h-40 space-y-3 rounded-lg p-4 shadow  ${selectedRows.includes(row.user_id) ? "bg-theme-orange bg-opacity-10" : ""}`}
              onClick={() => toggleRowSelection(row.user_id)}
            >
              {/* avatar + name */}
              <div className="flex items-center">
                <div className="relative h-8 w-8 flex-shrink-0">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={row.avatar}
                    alt="avatar"
                  />
                  {row.is_active && (
                    <>
                      <span className="absolute  right-0.5 top-1 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                      <span className="absolute  right-0.5 top-1 h-3 w-3 animate-ping rounded-full  bg-green-500"></span>
                    </>
                  )}
                </div>
                <div className="ml-2">
                  <div className="break-words font-amazon-ember text-sm font-medium text-gray-900">
                    {row.firstName} {row.lastName}
                  </div>
                </div>
              </div>
              {/* email */}
              <div className="break-words font-amazon-ember text-xs text-gray-700">
                {row.email}
              </div>
              {/* role + action */}
              <div className="flex items-center justify-between space-x-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${row.role === "ADMIN" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                >
                  {row.role}
                </span>
                <div className="flex space-x-6">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 "
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaEdit className="size-5" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MdDelete className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div>
        <Pagination
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          count={searchedData.length}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default UserManagementPage;
