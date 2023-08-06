import he from 'he';
import flatpickr from 'flatpickr';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {POINT_EMPTY, TYPES} from '../const.js';
import {getCurrentDate, getFirstLetterUppercase} from '../utils/point.js';

import 'flatpickr/dist/flatpickr.min.css';

function createTypeItem(types, point) {

  return types.map((type) => {
    const checked = (type === point.type) ? 'checked' : '';
    const typeLabel = getFirstLetterUppercase(type);

    return (`
      <div class="event__type-item">
        <input
          id="${type}-${point.id}"
          class="event__type-input visually-hidden"
          type="radio"
          name="event-type"
          value="${type}"
          ${checked}
        >
        <label
          class="event__type-label  event__type-label--${type}"
          for="${type}-${point.id}"
        >
            ${typeLabel}
        </label>
      </div>
  `);
  }).join('');
}

function createCityItems(pointDestinations) {
  return pointDestinations.map((point) => (`
    <option value="${point.name}"></option>
  `)).join('');
}

function createOffersItems({point, allOffers, pointOffers}) {
  const offersPoint = allOffers.find((pointOffer) => pointOffer.type === point.type);
  return offersPoint.offers.map((offer) => {
    const checked = pointOffers.includes(offer.id) ? 'checked' : '';

    return (`
      <div class="event__offer-selector">
        <input
          class="event__offer-checkbox visually-hidden"
          id="${offer.id}-${point.id}"
          type="checkbox"
          name="${offer.id}-${point.id}"
          value="${offer.id}"
          ${checked}
        >
        <label class="event__offer-label" for="${offer.id}-${point.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `);
  }).join('');
}

function createDescriptionItem(point, pointDestinations) {
  return pointDestinations.map((pointDestination) => {
    const destination = pointDestination.id.includes(point.destination);
    if (destination) {

      return (`
        <p class="event__destination-description">${pointDestination.description}</p>
      `);
    }
  }).join('');
}

function createImageItem(point, pointDestinations) {

  return pointDestinations.map((pointDestination) => {
    const destination = pointDestination.id.includes(point.destination);
    if (destination) {

      return pointDestination.pictures.map((picture) => (`
        <img class="event__photo" src="${picture.src}" alt=""${picture.description}">
      `)).join('');
    }
  }).join('');
}

function createFormButtonTemplate(isEditMode, isDisabled, isSaving, isDeleting) {
  // <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
  // <button class="event__reset-btn" type="reset">${resetButton}</button>
  // ${rollupButton}
  const rollupButton = isEditMode ? '<button class="event__rollup-btn" type="button">' : '';
  let textButtonReset = isEditMode ? 'Cancel' : 'Delete';
  console.log('isDisabled', isDisabled);
  console.log('isSaving', isSaving);
  console.log('isDeleting', isDeleting);
  console.log('isEditMode', isEditMode);

  if (isDeleting) {
    textButtonReset = isEditMode ? 'Cancelling...' : 'Deleting...';
  }

  return `
    <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}> ${textButtonReset}</button>
    ${rollupButton}
    <span class="visually-hidden">Open event</span>
    </button>
  `;
}

function createPointEditTemplate({point, pointDestinations, allOffers, isEditMode}) {
  const {basePrice, dateFrom, dateTo, offers, type, destination, typeImg = type.toLowerCase(), isDisabled, isSaving, isDeleting} = point;
  const destinationById = pointDestinations.find((itemDestination) => itemDestination.id === destination);
  const pointCity = isEditMode ? destinationById.name : '';

  console.log('isDisabledUp', isDisabled);
  console.log('isSavingUp', isSaving);
  console.log('isDeletingUp', isDeleting);
  console.log('isEditModeUp', isEditMode);
  let pointOffers = offers;
  if (offers === undefined) {
    pointOffers = allOffers.find(allOffers.type === type);
    return pointOffers;
  }
  return (`
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${typeImg}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createTypeItem(TYPES, point)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input
             class="event__input event__input--destination"
             id="event-destination-1"
             type="text"
             name="event-destination"
             value="${he.encode(pointCity)}"
             list="destination-list-1"
             ${isDisabled ? 'disabled' : ''}
            >
            <datalist id="destination-list-1">
              ${createCityItems(pointDestinations)}
            </datalist>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input
              class="event__input event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              value="${he.encode(getCurrentDate(dateFrom))}"
              ${isDisabled ? 'disabled' : ''}
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input event__input--time"
              id="event-end-time-1"
              type="text" name="event-end-time"
              value="${he.encode(getCurrentDate(dateTo))}"
              required
              ${isDisabled ? 'disabled' : ''}
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-1"
              type="text"
              name="event-price"
              value="${he.encode(`${basePrice}`)}"
              required
              ${isDisabled ? 'disabled' : ''}
            >
          </div>
          ${createFormButtonTemplate(isDisabled, isSaving, isDeleting, isEditMode)}
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${createOffersItems({point, allOffers, pointOffers})}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            ${createDescriptionItem(point, pointDestinations)}
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${createImageItem(point, pointDestinations)}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>
  `);
}


export default class PointEditView extends AbstractStatefulView {
  #pointDestinations = null;
  #allOffers = null;
  #onResetClick = null;
  #onSubmitClick = null;
  #onDeleteClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #isEditMode = null;

  constructor({
    point = POINT_EMPTY,
    pointDestinations,
    allOffers,
    onSubmitClick,
    onResetClick,
    onDeleteClick,
    isEditMode = true
  }) {
    super();
    this._setState(PointEditView.parsePointToState(point));
    this.#pointDestinations = pointDestinations;
    this.#allOffers = allOffers;

    this.#onResetClick = onResetClick;
    this.#onSubmitClick = onSubmitClick;
    this.#onDeleteClick = onDeleteClick;
    this.#isEditMode = isEditMode;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate({
      point: this._state,
      pointDestinations: this.#pointDestinations,
      allOffers: this.#allOffers,
      isEditMode: this.#isEditMode
    });
  }

  reset(point) {
    this.updateElement(
      PointEditView.parsePointToState(point),
    );
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  _restoreHandlers() {
    if (this.element
      .querySelector('.event__rollup-btn')) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#resetButtonClickHandler);
    }

    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#typeInputClickHandler);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationInputChangeHandler);

    const offerBlock = this.element
      .querySelector('.event__available-offers');

    if (offerBlock) {
      offerBlock.addEventListener('change', this.#offersChangeHandler);
    }

    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#priceInputHandler);

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);

    this.#setDatepickers();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitClick(PointEditView.parseStateToPoint(this._state));
  };

  #resetButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onResetClick();
  };

  #typeInputClickHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #destinationInputChangeHandler = (evt) => {
    evt.preventDefault();

    const newDestinationName = evt.target.value;
    const newDestination = this.#pointDestinations.find((destination) => destination.name === newDestinationName);

    if (newDestination) {
      this.updateElement({
        destination: newDestination.id,
      });
    }
  };

  #offersChangeHandler = (evt) => {
    const newOffers = evt.target.checked
      ? this._state.offers.concat(evt.target.value)
      : this._state.offers.filter((offerId) => offerId !== evt.target.value);

    this._setState({
      offers: newOffers
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
    this.#datepickerFrom.set('maxDate', this._state.dateTo);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #setDatepickers = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromChangeHandler,
        enableTime: true,
        maxDate: this._state.dateTo,
        locale: {
          firstDayOfWeek: 1,
        },
        'time_24hr': true
      },
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onClose: this.#dateToChangeHandler,
        enableTime: true,
        minDate: this._state.dateFrom,
        locale: {
          firstDayOfWeek: 1,
        },
        'time_24hr': true
      },
    );
  };

  static parsePointToState(point) {
    return {...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}

