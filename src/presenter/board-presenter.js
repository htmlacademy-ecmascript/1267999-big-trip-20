import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import TripSortPointView from '../view/trip-sort-point-view.js';
import PointListView from '../view/point-list-view.js';
import NoPointView from '../view/no-point-view.js';

import {sortRules} from '../utils/sort.js';
import {render, replace, remove} from '../framework/render.js';
import {SortType, UserAction, UpdateType, FilterType} from '../const.js';
import {filterRules} from '../utils/filter.js';

export default class BoardPresenter {
  #boardContainer = null;

  #sortComponent = null;
  #pointListComponent = new PointListView();

  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #filterModel = null;

  #currentSortType = SortType.DAY;

  #pointPresenters = new Map();
  #newPointPresenter = null;

  constructor({boardContainer, destinationsModel, offersModel, pointsModel, filterModel, onNewPointDestroy}) {
    this.#boardContainer = boardContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#pointListComponent.element,
      onDataChange: this.#actionViewHandler,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#eventModelHandler);
    this.#filterModel.addObserver(this.#eventModelHandler);
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filterRules[filterType](points);
    if (this.#currentSortType) {
      return sortRules[this.#currentSortType](filteredPoints);
    }
    return filteredPoints;
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#pointListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onChangeData: this.#actionViewHandler,
      onChangeMode: this.#modeChangeHandler
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    this.points.forEach((point) => this.#renderPoint(point));
  };

  #renderSort = () => {
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new TripSortPointView({
      sortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });

    if (prevSortComponent) {
      replace(this.#sortComponent, prevSortComponent);
      remove(prevSortComponent);
    } else {
      render(this.#sortComponent, this.#boardContainer);
    }
  };

  #renderPointContainer = () => {
    render(this.#pointListComponent, this.#boardContainer);
  };

  #actionViewHandler = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #eventModelHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedPointCount: true});
    this.#renderSort();
    this.#renderBoard();
  };

  #modeChangeHandler = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderBoard = () => {
    if (this.points.length === 0) {
      render(new NoPointView(), this.#boardContainer);
      return;
    }

    this.#renderSort();
    this.#renderPointContainer();
    this.#renderPoints();
  };

  #clearBoard({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#newPointPresenter.destroy();
    this.#pointPresenters.clear();

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }
}
