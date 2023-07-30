import Observable from '../framework/observable.js';
import {render, replace, remove} from '../framework/render.js';
import TripFiltersView from '../view/trip-filters-view.js';
import {filterRules} from '../utils/filter.js';
import {UpdateType} from '../const.js';

export default class FilterPresenter extends Observable {
  #filterContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #filterComponent = null;

  constructor({filterContainer, pointsModel, filterModel}) {
    super();
    this.#filterContainer = filterContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelPoint);
    this.#filterModel.addObserver(this.#handleModelPoint);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return Object.entries(filterRules)
      .map(([filterType, filterPoints]) => ({
        type: filterType,
        hasPoints: filterPoints(points).length > 0
      }));
  }

  init() {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new TripFiltersView({
      filters: this.filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelPoint = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

}
