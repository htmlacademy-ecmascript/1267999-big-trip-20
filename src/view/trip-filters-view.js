import AbstractView from '../framework/view/abstract-view.js';
import {formatStringToCapital} from '../utils/point.js';

function createFilterItem(filter, currentFilterType) {
  return (`
    <div class="trip-filters__filter">
      <input
        id="filter-${filter.type}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filter.type}" ${(filter.hasPoints) ? '' : 'disabled'}
        ${filter.type === currentFilterType ? 'checked' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${filter.type}">${formatStringToCapital(filter.type)}</label>
    </div>
  `);
}

function createTripFiltersTemplate({filters, currentFilterType}) {
  return (`
    <div class="trip-main__trip-controls  trip-controls">
      <div class="trip-controls__filters">
        <h2 class="visually-hidden">Filter events</h2>
        <form class="trip-filters" action="#" method="get">
          ${filters.map((filter) => createFilterItem(filter, currentFilterType)).join('')}
          <button class="visually-hidden" type="submit">Accept filter</button>
        </form>
      </div>
    </div>
  `);
}

export default class TripFiltersView extends AbstractView {
  #filters = null;
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createTripFiltersTemplate({
      filters: this.#filters,
      currentFilterType: this.#currentFilterType
    });
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
