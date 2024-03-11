import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Modal from "../Modal";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./index.css";

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSubmit = ({ title, startDate, startTime, endTime }) => {
    if (selectedDate) {
      const startDateTime = new Date(
        `${selectedDate.toISOString().split("T")[0]}T${startTime}`,
      );
      const endDateTime = new Date(
        `${selectedDate.toISOString().split("T")[0]}T${endTime}`,
      );

      if (endDateTime > startDateTime) {
        const newEvent = {
          title,
          start: startDateTime,
          end: endDateTime,
        };

        setEvents([...events, newEvent]);
        setModalOpen(false);
      } else {
        alert("End time should be later than start time.");
      }
    } else {
      // Handle the case when selectedDate is null
      alert("Please select a date before adding an event.");
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setModalOpen(true);
    console.log();
  };

  const handleAddEventClick = () => {
    setSelectedDate(new Date());
    setModalOpen(true);
  };

  return (
    <div className="flex w-screen justify-center gap-10">
      <div className="flex w-screen flex-col lg:w-2/3 2xl:w-[1000px]">
        <div className="mb-2 flex items-center justify-between px-5 lg:mb-10">
          <h1 className="text-2xl font-semibold">Add Your Schedule</h1>
          <button
            className="text-md rounded bg-theme-orange px-3 py-1 text-black transition-colors duration-300 ease-in-out hover:bg-theme-dark-orange  hover:text-white md:px-5 md:py-1 xl:px-6"
            onClick={handleAddEventClick}
          >
            Add Event
          </button>
        </div>
        <div className="h-[550px] px-5 md:h-[800px]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable={true}
            onSelectSlot={(slotInfo) => handleDateClick(slotInfo.start)}
          />
        </div>

        {isModalOpen && (
          <Modal
            closeModal={() => setModalOpen(false)}
            onSubmit={handleSubmit}
            selectedDate={selectedDate}
          />
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
