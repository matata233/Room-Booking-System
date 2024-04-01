import React from "react";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import { setSuggestedTimeInput } from "../slices/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import { nextDayAtTen, sevenDaysLaterAtTen } from "../utils/getDateTime";
import dayjs from "dayjs";

const SuggestedTimeInput = () => {
  const dispatch = useDispatch();
  const { suggestedTimeInput } = useSelector((state) => state.booking);

  const beforeToday = () => {
    return (date) => {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      return date < startOfToday;
    };
  };

  const predefinedRanges = [
    {
      label: "Today",
      value: [new Date(), new Date()],
    },
    {
      label: "Next 7 Days",
      value: [nextDayAtTen, sevenDaysLaterAtTen],
    },
  ];

  const handleDurationChange = (e) => {
    const newDuration = e.target.value;
    dispatch(
      setSuggestedTimeInput({
        ...suggestedTimeInput,
        duration: newDuration,
      }),
    );
  };

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    dispatch(
      setSuggestedTimeInput({
        ...suggestedTimeInput,
        unit: newUnit,
      }),
    );
  };

  const handleDateRangeChange = (value) => {
    if (!value) return;
    const formattedStartTime = dayjs(value[0]).format("YYYY-MM-DD HH:mm");
    const formattedEndTime = dayjs(value[1]).format("YYYY-MM-DD HH:mm");
    dispatch(
      setSuggestedTimeInput({
        ...suggestedTimeInput,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      }),
    );
  };

  return (
    <div className="flex w-80 flex-col rounded-lg bg-gray-200 p-4">
      <div className="mb-2">Time Range</div>
      <DateRangePicker
        format="yyyy-MM-dd HH:mm"
        ranges={predefinedRanges}
        shouldDisableDate={beforeToday()}
        onChange={handleDateRangeChange}
        cleanable={false}
        value={[
          new Date(suggestedTimeInput?.startTime),
          new Date(suggestedTimeInput?.endTime),
        ]}
      />
      <div className="mb-2 mt-4">Duration</div>
      <div className="flex items-center justify-between">
        <input
          type="number"
          min="1"
          value={suggestedTimeInput?.duration}
          onChange={handleDurationChange}
          className="rounded-lg border px-1 py-1 focus:outline-none"
          placeholder="Duration"
        />

        <select
          value={suggestedTimeInput?.unit}
          onChange={handleUnitChange}
          className="cursor-pointer rounded-lg border px-1 py-1 focus:outline-none"
        >
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
          <option value="days">Days</option>
        </select>
      </div>
    </div>
  );
};

export default SuggestedTimeInput;
