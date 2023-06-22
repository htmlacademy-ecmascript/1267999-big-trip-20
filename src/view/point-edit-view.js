import AbstractView from '../framework/view/abstract-view.js';
import {POINT_EMPTY, TYPES} from '../const.js';
import {getCurrentDate} from '../utils/point.js';

function createTypeItem(types, point) {
  const typePoint = point.type;
  return types.map((type) => {
    const checked = (type === typePoint) ? 'checked' : '';
    return (`
      <div class="event__type-item">
        <input
          id="event-type-${type.toLowerCase()}-1"
          class="event__type-input visually-hidden"
          type="radio"
          name="event-type"
          value="${type.toLowerCase()}"
          ${checked}
        >
        <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
      </div>
  `);
  }).join('');
}

function createCityItems(pointDestinations) {
  return pointDestinations.map((point) => (`
    <option value="${point.name}"></option>
  `)).join('');
}

function createOffersItems({point, pointOffers, offers}) {
  const typePoint = point.type;
  const offersPoint = pointOffers.find((pointOffer) => pointOffer.type === typePoint);

  return offersPoint.offers.map((offer) => {
    const checked = (offers.includes(offer.id)) ? 'checked' : '';
    const offerClass = offer.title.trim().toLowerCase().replace(/[^a-zA-Z0-9 -]/, '').replace(/\s/g, '-');
    return (`
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-${offerClass}-1" type="checkbox" name="event-${offerClass}" ${checked}>
      <label class="event__offer-label" for="event-${offerClass}-1">
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
        <div class="event__photos-container">
            <div class="event__photos-tape">
              <img class="event__photo" src="${picture.src}" alt=""${picture.description}">
            </div>
          </div>
      `));
    }
  }).join('');
}

function createPointEditTemplate({point, pointDestinations, pointOffers}) {
  const {basePrice, dateFrom, dateTo, offers, type, typeImg = type.toLowerCase()} = point;
  return (`
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${typeImg}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

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
             list="destination-list-1"
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
              value="${getCurrentDate(dateFrom)}"
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input event__input--time"
              id="event-end-time-1"
              type="text" name="event-end-time"
              value="${getCurrentDate(dateTo)}"
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${createOffersItems({point, pointOffers, offers})}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            ${createDescriptionItem(point, pointDestinations)}
            ${createImageItem(point, pointDestinations)}
          </section>
        </section>
      </form>
    </li>
  `);
}


export default class PointEditView extends AbstractView {
  #point = null;
  #pointDestinations = null;
  #pointOffers = null;
  #onSubmitClick = null;

  constructor({point = POINT_EMPTY, pointDestinations, pointOffers, onSubmitClick}) {
    super();
    this.#point = point;
    this.#pointDestinations = pointDestinations;
    this.#pointOffers = pointOffers;
    this.#onSubmitClick = onSubmitClick;

    this.element
      .querySelector('.event__save-btn')
      .addEventListener('click', this.#submitHandler);
  }

  get template() {
    return createPointEditTemplate({
      point: this.#point,
      pointDestinations: this.#pointDestinations,
      pointOffers: this.#pointOffers,
    });
  }

  #submitHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitClick();
  };
}

