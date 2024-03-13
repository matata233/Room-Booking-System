import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AddEventModal from "../AddEventModal";
import EditEventModal from "../EditEventModal";
import EventDetailsModal from "../EventDetailsModal";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./index.css";
import dayjs from "dayjs";

const localizer = momentLocalizer(moment);

const exampleEvents = [
  {
    id: uuidv4(),
    title: "Meeting with Team",
    start: dayjs(new Date(2024, 2, 11, 10, 0)).format("YYYY-MM-DD HH:mm:ss"),
    end: dayjs(new Date(2024, 2, 11, 11, 30)).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    id: uuidv4(),
    title: "Lunch with Client",
    start: dayjs(new Date(2024, 2, 12, 12, 30)).format("YYYY-MM-DD HH:mm:ss"),
    end: dayjs(new Date(2024, 2, 12, 14, 0)).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    id: uuidv4(),
    title: "Project Deadline",
    start: dayjs(new Date(2024, 2, 15, 15, 0)).format("YYYY-MM-DD HH:mm:ss"),
    end: dayjs(new Date(2024, 2, 15, 17, 0)).format("YYYY-MM-DD HH:mm:ss"),
  },
];

const EventCalendar = () => {
  const [events, setEvents] = useState(exampleEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDetails, setIsDetails] = useState(false);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsDetails(true);
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setIsAdding(true);
  };

  const handleEditEvent = () => {
    setIsDetails(false);
    setIsEditing(true);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId),
    );
    handleCloseModal();
  };

  const handleSaveEvent = (event) => {
    if (dayjs(event.start).isAfter(dayjs(event.end))) {
      alert("End time should be later than start time.");
      return;
    }
    if (isEditing) {
      // If editing an existing event
      setEvents((prevEvents) =>
        prevEvents.map((prevEvent) =>
          prevEvent.id === selectedEvent.id
            ? { ...prevEvent, ...event }
            : prevEvent,
        ),
      );
    } else {
      // If adding a new event
      setEvents((prevEvents) => [...prevEvents, { id: uuidv4(), ...event }]);
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setSelectedDate(null);
    setIsEditing(false);
    setIsAdding(false);
    setIsDetails(false);
  };

  // const handleTest = () => {
  //   events.forEach((event) => {
  //     console.log("event", event);
  //   });
  //   console.log("second");
  // };

  return (
    <div className="flex w-screen justify-center gap-10">
      <div className="flex w-screen flex-col lg:w-2/3 2xl:w-[1000px]">
        <div className="mb-6 flex items-center justify-between px-5 lg:mb-10">
          <h1 className="font-natural text-2xl md:font-semibold">
            Add Your Schedule
          </h1>
          <button
            className="text-md rounded bg-theme-orange px-3 py-1 text-black transition-colors duration-300 ease-in-out hover:bg-theme-dark-orange  hover:text-white md:px-5 md:py-1 xl:px-6"
            onClick={(date) => handleSelectDate(new Date())}
          >
            Add Event
          </button>
        </div>
        <div className="h-[550px] px-5 md:h-[800px]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor={(event) => {
              return new Date(event.start);
            }}
            endAccessor={(event) => {
              return new Date(event.end);
            }}
            selectable
            onSelectEvent={handleSelectEvent}
            onSelectSlot={(date) => handleSelectDate(date.start)}
          />
        </div>

        {isDetails && (
          <EventDetailsModal
            event={selectedEvent}
            onClose={handleCloseModal}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
          />
        )}

        {isEditing && (
          <EditEventModal
            event={selectedEvent}
            onUpdate={handleSaveEvent}
            onClose={handleCloseModal}
          />
        )}

        {isAdding && (
          <AddEventModal
            selectedDate={selectedDate}
            onAdd={handleSaveEvent}
            onClose={handleCloseModal}
          />
        )}
        {/* <div className="flex justify-center">
          <button
            onClick={handleTest}
            className="my-4 rounded bg-theme-orange px-12 py-2 text-black transition-colors duration-300 ease-in-out hover:bg-theme-dark-orange hover:text-white"
          >
            test
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default EventCalendar;
