import dayjs from "dayjs";

const getNextDay = () => {
  return dayjs().add(1, "day").startOf("day");
};

const nextDay = getNextDay();

const getNextDayWithTime = () => {
  return dayjs().add(1, "day").startOf("day").hour(10);
};

const nextDayAtTen = getNextDayWithTime();

const getSevenDaysFromNowWithTime = () => {
  return dayjs().add(7, "day").startOf("day").hour(10);
};

const sevenDaysLaterAtTen = getSevenDaysFromNowWithTime();

const getNextDayAtNoon = () => {
  return dayjs().add(1, "day").startOf("day").hour(12);
};

const nextDayAtNoon = getNextDayAtNoon();

export { nextDay, nextDayAtTen, sevenDaysLaterAtTen, nextDayAtNoon };
