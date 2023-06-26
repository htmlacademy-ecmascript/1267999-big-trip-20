import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import {SortType} from '../const';

dayjs.extend(duration);
dayjs.extend(relativeTime);

function sortByTime (pointPrevious, pointNext) {
  const durationA = dayjs(pointPrevious.dateTo).diff(dayjs(pointPrevious.dateFrom));
  const durationB = dayjs(pointNext.dateTo).diff(dayjs(pointNext.dateFrom));
  return pointNext - pointPrevious;
}

function sortByPrice (pointNext, pointPrevious) {
  return pointPrevious.basePrice - pointNext.basePrice;
}

function sortByDay (pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

if (!Array.prototype.toSorted) {
  Array.prototype.toSorted = function (fn) {
    return [...this].sort(fn);
  };
}

const sort = {
  [SortType.DAY]: (points) => points.toSorted(sortByDay),
  [SortType.PRICE]: (points) => points.toSorted(sortByPrice),
  [SortType.TIME]: (points) => points.toSorted(sortByTime),
  [SortType.EVENT]: () => {
    throw new Error(`Sort by ${SortType.EVENT} is not implemented`);
  },
  [SortType.OFFER]: () => {
    throw new Error(`Sort by ${SortType.OFFER} is not implemented`);
  }
};

export {sortByTime, sortByPrice, sortByDay, sort};
