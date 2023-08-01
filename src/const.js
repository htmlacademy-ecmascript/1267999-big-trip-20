const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const CITIES = ['Geneva', 'Amsterdam', 'Chamonix', 'Rotterdam', 'Helmond', 'Breda'];
const Price = {
  MIN: 1,
  MAX: 100
};
const Duration = {
  HOUR: 5,
  DAY: 5,
  MIN: 59
};
const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;
const DESCRIPTION = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.'
];
const DESTINATION_COUNT = 5;
const OFFER_COUNT = 5;
const POINT_COUNT = 5;
const DEFAULT_TYPE = 'Flight';
const POINT_EMPTY = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: DEFAULT_TYPE
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

const AUTHORIZATION = 'Basic su9jkskKisSkmS9rsS';

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

export {
  DESCRIPTION,
  TYPES,
  CITIES,
  Price,
  Duration,
  MSEC_IN_SEC,
  SEC_IN_MIN,
  MIN_IN_HOUR,
  HOUR_IN_DAY,
  DESTINATION_COUNT,
  OFFER_COUNT,
  POINT_COUNT,
  POINT_EMPTY,
  FilterType,
  Mode,
  SortType,
  UserAction,
  UpdateType,
  AUTHORIZATION,
  END_POINT,
  Method,
  Url
};
