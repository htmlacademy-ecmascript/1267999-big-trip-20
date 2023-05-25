import {createElement} from '../render.js';
import {formatStringToDateTime, formatStringToShortDate, formatStringToHours, getPointDuration} from '../utils.js';

function createOffersTemplate({pointOffers, offers}) {
  const pointOffer = pointOffers.filter((value) => value.id === offers[0])[0];
  if (pointOffer) {
    const price = (pointOffer) ? pointOffer.price : '';
    const title = (pointOffer) ? pointOffer.title : '';
    return (`<ul class="event__selected-offers">
    <li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>
  </ul>`);
  } else {
    return ('');
  }
}

function createEventDefaultTemplate({point, pointDestination, pointOffers}) {
  const {basePrice, dateFrom, dateTo, offers, isFavorite, type} = point;
  const favoriteButton = (isFavorite) ? 'event__favorite-btn--active' : '';
  const {name} = pointDestination;
  return (`<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime=${formatStringToDateTime(dateFrom)}>${formatStringToShortDate(dateFrom)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
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
    ${createOffersTemplate({pointOffers, offers})}
    <button class="event__favorite-btn ${favoriteButton}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`);
}

export default class EventDefaultView {
  constructor({point, pointDestination, pointOffers}) {
    this.point = point;
    this.pointDestination = pointDestination;
    this.pointOffers = pointOffers;
  }

  getTemplate() {
    return createEventDefaultTemplate({
      point: this.point,
      pointDestination: this.pointDestination,
      pointOffers: this.pointOffers
    });
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
