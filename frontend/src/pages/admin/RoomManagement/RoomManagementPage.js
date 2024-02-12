import React, { useState, useMemo } from "react";
import useSearchData from "../../../hooks/useSearchData";
import usePaginateData from "../../../hooks/usePaginateData";
import useSortData from "../../../hooks/useSortData";
import useRowSelection from "../../../hooks/useRowSelection";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaSort } from "react-icons/fa6";
import { PiSelectionAllFill } from "react-icons/pi";
import dummyRooms from "../../../dummyRooms";
import Pagination from "../../../components/Pagination";

const UserManagementPage = () => {
  const data = useMemo(() => dummyRooms, []);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { sortedData, sortBy } = useSortData(dummyRooms);
  const searchedData = useSearchData(sortedData, search, selectedCategory, [
    "is_active",
  ]);
  const displayedData = usePaginateData(searchedData, currentPage, rowsPerPage);

  const {
    selectedRows,
    setSelectedRows,
    toggleRowSelection,
    toggleAllSelection,
  } = useRowSelection(dummyRooms, "roomId");

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
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2 sm:flex-row sm:justify-between">
        {/* Search Bar */}
        <div className="font-amazon-ember flex flex-grow gap-x-2">
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
              <option value="roomId">Room Id</option>
              <option value="location">Location</option>
              <option value="equipments">Equipments</option>
              <option value="capacity">Capacity</option>
            </select>
          </div>
        </div>

        {/* Select All + Delete Selected  (mobile) */}
        <div className="flex justify-start gap-x-4 ">
          <a
            href="#"
            className={`flex h-8 w-8 items-center justify-center  rounded-lg border-2 border-theme-orange p-1.5 text-theme-orange transition-colors duration-300  ease-in-out hover:bg-theme-orange hover:text-white md:hidden ${
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
            className="flex h-8  w-8 items-center justify-center rounded-lg border-2 border-red-500 p-1.5 text-red-500 transition-colors duration-300 ease-in-out hover:bg-red-500 hover:text-white md:w-16"
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
              <th className="font-amazon-ember p-3 text-left font-medium uppercase tracking-wider text-gray-500">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(searchedData.map((row) => row.roomId));
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
                { key: "roomId", display: "Room Id" },
                { key: "numSeat", display: "Capacity" },
              ].map((header) => (
                <th
                  key={header.key}
                  onClick={() => sortBy(header.key)} // Use the key for sorting
                  className="font-amazon-ember cursor-pointer p-3 text-left text-base font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
                >
                  <div className="flex items-center gap-3">
                    {header.display} <FaSort />
                  </div>
                </th>
              ))}
              {[
                { key: "location", display: "Location" },
                { key: "equipments", display: "Equipments" },
                { key: "is_active", display: "Status" },
              ].map((header) => (
                <th
                  key={header.key}
                  className="font-amazon-ember p-3 text-left text-base font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
                >
                  {header.display}
                </th>
              ))}
              <th className="font-amazon-ember p-3 text-left text-base font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedData.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-md font-amazon-ember whitespace-nowrap p-3 text-center font-medium text-gray-900"
                >
                  No result
                </td>
              </tr>
            ) : (
              displayedData.map((row) => (
                <tr
                  key={row.roomId}
                  className={`font-amazon-ember hover:bg-theme-orange hover:bg-opacity-10 ${selectedRows.includes(row.roomId) ? "bg-theme-orange bg-opacity-10" : ""}`}
                  onClick={() => toggleRowSelection(row.roomId)}
                >
                  <td className="whitespace-nowrap p-3 text-sm text-gray-900">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.roomId)}
                      className="accent-theme-orange"
                    />
                  </td>
                  <td className="whitespace-nowrap p-3 text-sm text-gray-900">
                    {row.roomId}
                  </td>
                  <td className="whitespace-nowrap p-3 text-sm text-gray-500">
                    {row.numSeat}
                  </td>
                  <td className="whitespace-nowrap p-3 text-sm text-gray-500">
                    <ul>
                      <li>
                        <span className="text-theme-blue">City:</span>{" "}
                        {row.location.city}
                      </li>
                      <li>
                        <span className="text-theme-blue">Building:</span>{" "}
                        {row.location.building}
                      </li>
                      <li>
                        <span className="text-theme-blue">Floor:</span>{" "}
                        {row.location.floor}
                      </li>
                      <li>
                        <span className="text-theme-blue">Room:</span>{" "}
                        {row.location.room}
                      </li>
                    </ul>
                  </td>
                  <td className="whitespace-nowrap p-3 text-sm text-gray-500">
                    <ul>
                      {row.equipments.map((equipment, index) => (
                        <li key={index}>{equipment}</li>
                      ))}
                    </ul>
                  </td>

                  <td className="whitespace-nowrap p-3 text-sm text-gray-500">
                    {row.is_active ? (
                      <div className="h-4 w-4 rounded-full bg-green-500"></div>
                    ) : (
                      <div className="h-4 w-4 rounded-full  bg-red-500"></div>
                    )}
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
            <div className="text-md font-amazon-ember whitespace-nowrap p-3 font-medium text-gray-900">
              No result
            </div>
          </div>
        ) : (
          displayedData.map((row) => (
            <div
              key={row.roomId}
              className={`space-y-3 rounded-lg p-4 shadow hover:bg-theme-orange hover:bg-opacity-10  ${selectedRows.includes(row.roomId) ? "bg-theme-orange bg-opacity-10" : ""}`}
              onClick={() => toggleRowSelection(row.roomId)}
            >
              {/* room id */}
              <div className="font-amazon-ember break-words text-sm text-gray-900">
                <span className="font-bold text-theme-dark-orange">ID: </span>
                {`${row.roomId}`}
              </div>

              {/* Location + Equipments */}
              <div className="flex gap-x-10 md:justify-between">
                <div className="font-amazon-ember break-words text-sm text-gray-500">
                  <span className="block font-bold text-theme-dark-orange">
                    Location:
                  </span>
                  <ul>
                    <li>
                      <span className="text-theme-blue">City:</span>{" "}
                      {row.location.city}
                    </li>
                    <li>
                      <span className="text-theme-blue">Building:</span>{" "}
                      {row.location.building}
                    </li>
                    <li>
                      <span className="text-theme-blue">Floor:</span>{" "}
                      {row.location.floor}
                    </li>
                    <li>
                      <span className="text-theme-blue">Room:</span>{" "}
                      {row.location.room}
                    </li>
                  </ul>
                </div>
                <div className="font-amazon-ember break-words text-sm text-gray-500">
                  <span className="block font-bold text-theme-dark-orange">
                    Equipments:
                  </span>
                  <ul>
                    {row.equipments.map((equipment, index) => (
                      <li key={index}>{equipment}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* status + action */}
              <div className="flex items-center justify-between space-x-2">
                <div className="inline-flex items-center">
                  {row.is_active ? (
                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                  ) : (
                    <div className="h-4 w-4 rounded-full  bg-red-500"></div>
                  )}
                </div>
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
