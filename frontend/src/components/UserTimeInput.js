import React from "react";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import { setEndTime, setStartTime } from "../slices/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  allowedMaxDays,
  beforeToday,
  combine,
} from "rsuite/cjs/DateRangePicker/disabledDateUtils";

const UserTimeInput = () => {
  const dispatch = useDispatch();
  const { startTime, endTime } = useSelector((state) => state.booking);

  const predefinedRanges = [
    {
      label: "Now",
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
      <div className="mb-2">Start & End Time</div>
      <DateRangePicker
        format="yy-MMM-d H:mm"
        ranges={predefinedRanges}
        shouldDisableDate={combine(beforeToday(), allowedMaxDays(2))}
        onChange={handleDateRangeChange}
        cleanable={false}
        value={[new Date(startTime), new Date(endTime)]}
      />
    </div>
  );
};

export default UserTimeInput;
