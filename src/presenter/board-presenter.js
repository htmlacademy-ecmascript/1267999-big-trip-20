import PointPresenter from './point-presenter.js';
import TripSortPointView from '../view/trip-sort-point-view.js';
import PointListView from '../view/point-list-view.js';
import NoPointView from '../view/no-point-view.js';

import {updateItem} from '../utils/common.js';
import {sortRules} from '../utils/sort.js';
import {render, replace, remove} from '../framework/render.js';
import {SortType} from '../const.js';

export default class BoardPresenter {
  #boardContainer = null;

  #sortComponent = null;
  #pointListComponent = null;

  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;

  #points = [];
  #currentSortType = SortType.DAY;

  #pointPresenters = new Map();

  constructor({boardContainer, destinationsModel, offersModel, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;

    this.#points = sortRules[SortType.DAY]([...this.#pointsModel.points]);
  }

  init() {
    this.#renderBoard();
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#pointListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onChangeData: this.#pointChangeHandler,
      onChangeMode: this.#modeChangeHandler
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #sortPoints = (sortType) => {
    this.#currentSortType = sortType;
    this.#points = sortRules[this.#currentSortType](this.#points);
  };

  #renderPoints = () => {
    this.#points.forEach((point) => this.#renderPoint(point));
  };

  #clearPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
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
    this.#pointListComponent = new PointListView();
    render(this.#pointListComponent, this.#boardContainer);
  };

  #renderBoard = () => {
    if (this.#points.length === 0) {
      render(new NoPointView(), this.#boardContainer);
      return;
    }

    this.#renderSort();
    this.#renderPointContainer();
    this.#renderPoints();
  };

  #pointChangeHandler = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #sortTypeChangeHandler = (sortType) => {
    this.#sortPoints(sortType);
    this.#clearPoints();
    this.#renderSort();
    this.#renderPoints();
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
