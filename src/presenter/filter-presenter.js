import TripFiltersView from '../view/trip-filters-view.js';

import {generateFilters} from '../mock/filter.js';
import {render} from '../framework/render.js';

export default class FilterPresenter {
  #container = null;
  #pointsModel = null;
  #filters = [];

  constructor({container, pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;

    this.#filters = generateFilters(this.#pointsModel.points);
  }

  init() {
    render(new TripFiltersView(this.#filters), this.#container)
  }
}
