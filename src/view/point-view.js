import AbstractView from '../framework/view/abstract-view.js';
import {formatStringToDateTime, formatStringToShortDate, formatStringToHours, getPointDuration} from '../utils/point.js';

function createOffersTemplate({allOffers, offers}) {

  if (allOffers.length === 0) {

    return '';
  }

  return allOffers.map((typeOffer) => {
    offers.includes(typeOffer.id);
    const checked = offers.includes(typeOffer.id);

    if (!checked) {

      return '';
    }

    return (`
      <li class="event__offer">
        <span class="event__offer-title">${typeOffer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${typeOffer.price}</span>
      </li>
    `);
  }).join('');
}

function createPointTemplate({point, pointDestinations, allOffers}) {
  const {basePrice, dateFrom, dateTo, offers, isFavorite, type, typeImg = type.toLowerCase()} = point;
  const favoriteButtonClass = (isFavorite) ? 'event__favorite-btn--active' : '';
  const {name} = pointDestinations;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime=${formatStringToDateTime(dateFrom)}>${formatStringToShortDate(dateFrom)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${typeImg}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatStringToDateTime(dateFrom)}">${formatStringToHours(dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="${formatStringToDateTime(dateTo)}">${formatStringToHours(dateTo)}</time>
          </p>
          <p class="event__duration">${getPointDuration(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffersTemplate({allOffers, offers})}
        </ul>
        <button class="event__favorite-btn ${favoriteButtonClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `);
}

export default class PointView extends AbstractView {
  #point = null;
  #pointDestinations = null;
  #allOffers = null;
  #onEditClick = null;
  #onFavoriteClick = null;

  constructor({point, pointDestinations, allOffers, onEditClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#pointDestinations = pointDestinations;
    this.#allOffers = allOffers;
    this.#onEditClick = onEditClick;
    this.#onFavoriteClick = onFavoriteClick;
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element
      .querySelector('.event__favorite-icon')
      .addEventListener('click', this.#favoriteClick);
  }

  get template() {
    return createPointTemplate({
      point: this.#point,
      pointDestinations: this.#pointDestinations,
      allOffers: this.#allOffers
    });
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#onEditClick();
  };

  #favoriteClick = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick();
  };
}
