import React, { useState } from "react";
import dayjs from "dayjs";

const EditEvent = ({ onSubmit, selectedEvent }) => {
  const formatTime = (date) => {
    return date ? dayjs(date).format("HH:mm") : "";
  };

  const [editedTitle, setEditedTitle] = useState(selectedEvent.title);
  const [editedStartDate, setEditedStartDate] = useState(
    dayjs(selectedEvent.start).format("YYYY-MM-DD"),
  );

  const [editedStartTime, setEditedStartTime] = useState(
    formatTime(selectedEvent.start) || "",
  );

  const [editedEndTime, setEditedEndTime] = useState(
    formatTime(selectedEvent.end) || "",
  );

  const handleSaveEdit = () => {
    console.log(selectedEvent);
    console.log(editedStartDate);
    if (editedTitle && editedStartTime && editedEndTime) {
      onSubmit({
        editedTitle,
        editedStartTime,
        editedEndTime,
      });
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Edit Event</h2>
      <form>
        <div className="mb-3">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Event Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={editedStartDate}
            onChange={(e) => setEditedStartDate(e.target.value)}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-700"
          >
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={editedStartTime}
            onChange={(e) => setEditedStartTime(e.target.value)}
            className="mt-1 w-full rounded-md border p-2"
            aria-label="Start Time"
            required
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="endTime"
            className="block text-sm font-medium text-gray-700"
          >
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={editedEndTime}
            onChange={(e) => setEditedEndTime(e.target.value)}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        <button
          type="button"
          onClick={handleSaveEdit}
          className="rounded-md bg-theme-orange px-4 py-2 text-white hover:bg-theme-dark-orange"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
