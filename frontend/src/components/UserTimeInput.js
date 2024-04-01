import React from "react";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import { setStartTime, setEndTime } from "../slices/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import { nextDayAtTen, sevenDaysLaterAtTen } from "../utils/getDateTime";
import dayjs from "dayjs";

const UserTimeInput = () => {
  const dispatch = useDispatch();
  const { startTime, endTime } = useSelector((state) => state.booking);

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
  ];

  const handleDateRangeChange = (value) => {
    if (!value) return;
    const formattedStartTime = dayjs(value[0]).format("YYYY-MM-DD HH:mm");
    const formattedEndTime = dayjs(value[1]).format("YYYY-MM-DD HH:mm");
    dispatch(setStartTime(formattedStartTime));
    dispatch(setEndTime(formattedEndTime));
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
        value={[new Date(startTime), new Date(endTime)]}
      />
    </div>
  );
};

export default UserTimeInput;
