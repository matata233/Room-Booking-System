import React, { useState, useMemo } from "react";
import AddEventModal from "../AddEventModal";
import EditEventModal from "../EditEventModal";
import EventDetailsModal from "../EventDetailsModal";
import CancelConfirmationModal from "../CancelConfirmationModal";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./index.css";
import { useGetEventsQuery } from "../../slices/eventsApiSlice";
import {
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} from "../../slices/eventsApiSlice";
import { toast } from "react-toastify";

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  const { data: events, isLoading: isGetEventsLoading } = useGetEventsQuery();
  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const confirmDeleteMessage = "Are you sure you want to delete?";

  const eventsData = useMemo(() => {
    if (isGetEventsLoading || !events || !events.result) {
      return [];
    }
    return events.result;
  }, [isGetEventsLoading, events]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDetails, setIsDetails] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

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
    setEventToDelete(eventId);
    setIsDetails(false);
    setIsConfirmed(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEvent(eventToDelete).unwrap();
      toast.success("Event deleted");
    } catch (err) {
      toast.error(err?.data?.error || "Failed to delete event");
    }
    handleCloseModal();
  };

  const handleSaveEvent = async (event) => {
    try {
      if (isEditing) {
        await updateEvent({
          eventId: selectedEvent.eventId,
          updatedEvent: event,
        }).unwrap();
        toast.success("Event updated");
      } else {
        await createEvent(event).unwrap();
        toast.success("Event created");
      }
      // Close the modal
      handleCloseModal();
    } catch (err) {
      // Display error toast message
      toast.error(err?.data?.error || "Failed to save event");
    }
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setSelectedDate(null);
    setIsEditing(false);
    setIsAdding(false);
    setIsDetails(false);
    setIsConfirmed(false);
  };

  // const handleTest = () => {
  //   console.log(eventsData);
  //   // events.forEach((event) => {
  //   //   console.log("event", event);
  //   // });
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
            onClick={(date) => handleSelectDate(date.start)}
          >
            Add Event
          </button>
        </div>
        <div className="h-[550px] px-5 md:h-[800px]">
          <Calendar
            localizer={localizer}
            events={eventsData}
            startAccessor={(event) => {
              return new Date(event.startTime);
            }}
            endAccessor={(event) => {
              return new Date(event.endTime);
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

        {isConfirmed && (
          <CancelConfirmationModal
            confirmButton={"delete"}
            cancelButton={"close"}
            onConfirm={handleConfirmDelete}
            onClose={handleCloseModal}
            onCancel={handleCloseModal}
            message={confirmDeleteMessage}
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
