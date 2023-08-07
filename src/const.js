const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const Duration = {
  HOUR: 5,
  DAY: 5,
  MIN: 59
};
const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;

const DEFAULT_TYPE = TYPES[0];
const POINT_EMPTY = {
  id: '-1',
  type: DEFAULT_TYPE,
  destination: '',
  dateFrom: new Date,
  dateTo: new Date,
  basePrice: '',
  offers: [],
  isFavorite: false
};
const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'

};

const AUTHORIZATION = 'Basic sujkskKisSkmS9rsW';

const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

const Url = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers'
};

const noPointMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export {
  TYPES,
  Duration,
  MSEC_IN_SEC,
  SEC_IN_MIN,
  MIN_IN_HOUR,
  HOUR_IN_DAY,
  POINT_EMPTY,
  FilterType,
  Mode,
  SortType,
  UserAction,
  UpdateType,
  AUTHORIZATION,
  END_POINT,
  Method,
  Url,
  noPointMessage,
  TimeLimit
};
