import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import useSearchData from "../../../hooks/useSearchData";
import usePaginateData from "../../../hooks/usePaginateData";
import useSortData from "../../../hooks/useSortData";
import useRowSelection from "../../../hooks/useRowSelection";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaSort } from "react-icons/fa6";
import { PiSelectionAllFill } from "react-icons/pi";
import Pagination from "../../../components/Pagination";
import { useGetRoomsQuery } from "../../../slices/roomsApiSlice";
import Loader from "../../../components/Loader";
import Message from "../../../components/Message";

const RoomManagementPage = () => {
  const { data: rooms, error, isLoading, refetch } = useGetRoomsQuery();

  const roomsData = useMemo(() => {
    if (isLoading || !rooms || !rooms.result) {
      return [];
    }
    console.log("Got rooms data");
    return rooms.result;
  }, [isLoading, rooms]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { sortedData, sortBy } = useSortData(roomsData);
  const searchedData = useSearchData(sortedData, search, selectedCategory, [
    "isActive",
  ]);
  const displayedData = usePaginateData(searchedData, currentPage, rowsPerPage);

  const {
    selectedRows,
    setSelectedRows,
    toggleRowSelection,
    toggleAllSelection,
  } = useRowSelection(roomsData, "roomId");

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
    <div className="flex  flex-col justify-center gap-y-4 px-10 sm:px-0">
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
              <option value="roomId">Room Id</option>
              <option value="roomName">Room Name</option>
              <option value="roomCode">Room Code</option>
              <option value="building">Address</option>
              <option value="equipmentList">Equipments</option>
              <option value="numberOfSeats">Capacity</option>
            </select>
          </div>
        </div>

        {/* Add New Room + Select All (mobile)  + Delete Selected */}
        <div className="flex justify-start gap-x-4 ">
          <Link
            to="/roomManagementAddPage"
            className="flex h-8 cursor-pointer items-center rounded-lg bg-theme-orange px-4 py-2 font-amazon-ember text-sm text-theme-dark-blue transition-colors duration-300  ease-in-out hover:bg-theme-dark-orange hover:text-white  md:h-10 md:text-base"
          >
            Add New Room
          </Link>
          <a
            href="#"
            className={`flex h-8 w-8 items-center justify-center  rounded-lg border-2 border-theme-orange p-1.5 text-theme-orange transition-colors duration-300  ease-in-out  md:hidden ${
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
            className="flex h-8  w-8 items-center justify-center rounded-lg border-2 border-red-500 p-1.5 text-red-500 transition-colors duration-300 ease-in-out md:h-10 md:w-16"
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

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message severity="error">{error.data.message}</Message>
      ) : (
        <>
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
                          setSelectedRows(
                            searchedData.map((row) => row.roomId),
                          );
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
                    { key: "roomName", display: "Room Name" },
                    { key: "roomCode", display: "Room Code" },
                    { key: "numberOfSeats", display: "Capacity" },
                  ].map((header) => (
                    <th
                      key={header.key}
                      onClick={() => sortBy(header.key)} // Use the key for sorting
                      className="cursor-pointer p-3 text-left font-amazon-ember text-base font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        {header.display} <FaSort />
                      </div>
                    </th>
                  ))}
                  {[
                    { key: "address", display: "Address" },
                    { key: "equipments", display: "Equipments" },
                    { key: "isActive", display: "Status" },
                  ].map((header) => (
                    <th
                      key={header.key}
                      className="p-3 text-left font-amazon-ember text-base font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
                    >
                      {header.display}
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
                      colSpan="7"
                      className="text-md whitespace-nowrap p-3 text-center font-amazon-ember font-medium text-gray-900"
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
                      <td className="whitespace-nowrap p-3 text-sm text-gray-900">
                        {row.roomName}
                      </td>
                      <td className="whitespace-nowrap p-3 text-sm text-gray-900">
                        {row.roomCode}
                      </td>
                      <td className="whitespace-nowrap p-3 text-sm text-gray-500">
                        {row.numberOfSeats}
                      </td>
                      <td className="whitespace-nowrap p-3 text-sm text-gray-500">
                        <ul>
                          <li>
                            <span className="text-theme-blue">City:</span>{" "}
                            {`${row.city.name}, ${row.city.province_state}`}
                          </li>
                          <li>
                            <span className="text-theme-blue">Building:</span>{" "}
                            {row.building.code}
                          </li>
                          <li>
                            <span className="text-theme-blue">Floor:</span>{" "}
                            {row.floorNumber}
                          </li>
                        </ul>
                      </td>
                      <td className="whitespace-nowrap p-3 text-sm text-gray-500">
                        <ul>
                          {row.equipmentList.length > 0 ? (
                            row.equipmentList.map((equipment, index) => (
                              <li
                                key={index}
                              >{`${equipment.equipmentId}: ${equipment.description}`}</li>
                            ))
                          ) : (
                            <li>None</li>
                          )}
                        </ul>
                      </td>

                      <td className="whitespace-nowrap p-3 text-sm text-gray-500">
                        {row.isActive ? (
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
                <div className="text-md whitespace-nowrap p-3 font-amazon-ember font-medium text-gray-900">
                  No result
                </div>
              </div>
            ) : (
              displayedData.map((row) => (
                <div
                  key={row.roomId}
                  className={`space-y-3 rounded-lg p-4 shadow   ${selectedRows.includes(row.roomId) ? "bg-theme-orange bg-opacity-10" : ""}`}
                  onClick={() => toggleRowSelection(row.roomId)}
                >
                  <div className="font-amazon-ember text-sm text-gray-900">
                    {`${row.roomName} - ${row.roomCode}`}
                  </div>

                  {/* room id  + capacity*/}
                  <div className="flex gap-x-[86px]">
                    <div className="break-words font-amazon-ember text-sm text-gray-900">
                      <span className="font-bold text-theme-dark-orange">
                        ID:{" "}
                      </span>
                      {`${row.roomId}`}
                    </div>
                    <div className="break-words font-amazon-ember text-sm text-gray-900">
                      <span className="font-bold text-theme-dark-orange">
                        Capacity:{" "}
                      </span>
                      {`${row.numberOfSeats}`}
                    </div>
                  </div>

                  {/* Location + Equipments */}
                  <div className="flex gap-x-10 md:justify-between">
                    <div className="break-words font-amazon-ember text-sm text-gray-500">
                      <span className="block font-bold text-theme-dark-orange">
                        Address:
                      </span>
                      <ul>
                        <li>
                          <span className="text-theme-blue">City:</span>{" "}
                          {`${row.city.name}, ${row.city.province_state}`}
                        </li>
                        <li>
                          <span className="text-theme-blue">Building:</span>{" "}
                          {row.building.code}
                        </li>
                        <li>
                          <span className="text-theme-blue">Floor:</span>{" "}
                          {row.floorNumber}
                        </li>
                      </ul>
                    </div>
                    <div className="break-words font-amazon-ember text-sm text-gray-500">
                      <span className="block font-bold text-theme-dark-orange">
                        Equipments:
                      </span>
                      <ul>
                        {row.equipmentList.length > 0 ? (
                          row.equipmentList.map((equipment, index) => (
                            <li
                              key={index}
                            >{`${equipment.equipmentId}: ${equipment.description}`}</li>
                          ))
                        ) : (
                          <li>None</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* status + action */}
                  <div className="flex items-center justify-between space-x-2">
                    <div className="inline-flex items-center">
                      {row.isActive ? (
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
        </>
      )}

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

export default RoomManagementPage;
