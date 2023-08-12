import {MSEC_IN_SEC, SEC_IN_MIN, MIN_IN_HOUR, HOUR_IN_DAY} from '../const.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const MSEC_IN_HOUR = MSEC_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR;
const MSEC_IN_DAY = MSEC_IN_HOUR * HOUR_IN_DAY;

function getCurrentDate(date) {
  return dayjs(date).format('DD/MM/YY HH:mm');
}

function formatStringToDateTime(date) {
  return dayjs(date).format('YYYY-MM-DDTHH:mm');
}

function formatStringToShortDate(date) {
  return dayjs(date).format('MMM DD');
}

function formatStringToHours(date) {
  return dayjs(date).format('HH:mm');
}

function getPointDuration(dateFrom, dateTo) {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));
  let pointDuration = 0;

  switch (true) {
    case (timeDiff >= MSEC_IN_DAY):
      pointDuration = dayjs.duration(timeDiff).format('DD[D] HH[H] mm[M]');
      break;
    case (timeDiff >= MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('HH[H] mm[M]');
      break;
    case (timeDiff < MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('mm[M]');
      break;
  }

  return pointDuration;
}

function formatStringToCapital(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function isPointFuture(point) {
  return dayjs().isBefore(point.dateFrom);
}

function isPointPresent(point) {
  return (dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo));
}

function isPointPast(point) {
  return dayjs().isAfter(point.dateTo);
}

function getFirstLetterUppercase(event) {
  return event.charAt(0).toUpperCase() + event.slice(1);
}
function getPointsDateDifference(pointA, pointB) {
  return Date.parse(pointB.dateFrom) - Date.parse(pointA.dateFrom);
}

function getPointsDurationDifference(pointA, pointB) {
  const durationA = Date.parse(pointA.dateTo) - Date.parse(pointA.dateFrom);
  const durationB = Date.parse(pointB.dateTo) - Date.parse(pointB.dateFrom);

  return durationB - durationA;
}

function getPointsPriceDifference(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

export {
  getPointDuration,
  formatStringToDateTime,
  formatStringToShortDate,
  formatStringToHours,
  getCurrentDate,
  formatStringToCapital,
  isPointFuture,
  isPointPresent,
  isPointPast,
  getFirstLetterUppercase,
  getPointsDateDifference,
  getPointsDurationDifference,
  getPointsPriceDifference
};
