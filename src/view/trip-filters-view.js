import AbstractView from '../framework/view/abstract-view.js';
import {formatStringToCapital} from '../utils/point.js';

function createFilterItem(filter) {
  return (`
    <div class="trip-filters__filter">
      <input
        id="filter-${filter.type}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filter.type}" ${(filter.hasPoints) ? '' : 'disabled'}
      >
      <label class="trip-filters__filter-label" for="filter-${filter.type}">${formatStringToCapital(filter.type)}</label>
    </div>
  `);
}

function createTripFiltersTemplate({filters}) {
  return (`
    <div class="trip-main__trip-controls  trip-controls">
      <div class="trip-controls__filters">
        <h2 class="visually-hidden">Filter events</h2>
        <form class="trip-filters" action="#" method="get">
          ${filters.map(createFilterItem).join('')}
          <button class="visually-hidden" type="submit">Accept filter</button>
        </form>
      </div>
    </div>
  `);
}

export default class TripFiltersView extends AbstractView {
  #filters = null;

  constructor({filters}) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createTripFiltersTemplate({
      filters: this.#filters
    });
  }
}
