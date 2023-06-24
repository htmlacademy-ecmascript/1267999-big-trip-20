import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from "../const.js";

const enabledSortType = {
  [SortType.DAY]: true,
  [SortType.EVENT]: false,
  [SortType.TIME]: true,
  [SortType.PRICE]: true,
  [SortType.OFFER]: false
};
function getSortItem(sortItem) {
  return (`
  <div class="trip-sort__item  trip-sort__item--${sortItem.type}">
  <input
    id="sort-${sortItem.type}"
    class="trip-sort__input  visually-hidden"
    type="radio"
    name="trip-sort"
    value="sort-${sortItem.type}"
    data-sort-type="${sortItem.type}"
    ${(sortItem.isCheked) ? 'checked' : ''}
    ${(sortItem.isDisabled) ? 'disabled' : ''}
  >
  <label class="trip-sort__btn" for="sort-${sortItem.type}">
    ${sortItem.type}
  </label>
</div>
  `);
}

function createTripSortPointView({sortMap}) {
  return (`
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortMap.map((sortItem) => getSortItem(sortItem)).join('')}
    </form>
  `);
}

export default class TripSortPointView extends AbstractView {
  #sortMap = null;
  #handleSortTypeChange = null;

  constructor ({sortType, onSortTypeChange}) {
    super();
    this.#sortMap = Object.values(SortType)
      .map((type) => ({
        type,
        isCheked: (type === sortType),
        isDisabled: !enabledSortType[type]
      }));

    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createTripSortPointView({sortMap: this.#sortMap});
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.SortType);
  };
}
