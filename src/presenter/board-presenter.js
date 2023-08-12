import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import TripSortPointView from '../view/trip-sort-point-view.js';
import PointListView from '../view/point-list-view.js';
import NoPointView from '../view/no-point-view.js';
import LoadingView from '../view/loading-view.js';

import {sortRules} from '../utils/sort.js';
import {render, replace, remove} from '../framework/render.js';
import {SortType, UserAction, UpdateType, FilterType, TimeLimit} from '../const.js';
import {filterRules} from '../utils/filter.js';

export default class BoardPresenter {
  #boardContainer = null;

  #sortComponent = null;
  #pointListComponent = new PointListView();
  #loadingComponent = new LoadingView();
  #noPointComponent = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #filterModel = null;

  #currentFilterType = FilterType.EVERYTHING;
  #currentSortType = SortType.DAY;

  #pointPresenters = new Map();
  #newPointComponent = null;
  #isLoading = true;

  constructor({boardContainer, destinationsModel, offersModel, pointsModel, filterModel, onNewPointDestroy}) {
    this.#boardContainer = boardContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointComponent = new NewPointPresenter({
      container: this.#pointListComponent.element,
      onDataChange: this.#actionViewHandler,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#eventModelHandler);
    this.#filterModel.addObserver(this.#eventModelHandler);
  }

  get points() {
    this.#currentFilterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filterRules[this.#currentFilterType](points);

    if (this.#currentSortType) {
      return sortRules[this.#currentSortType](filteredPoints);
    }

    return filteredPoints;
  }

  init() {
    this.#renderBoard();
  }

  createPoint(point) {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointComponent.init({
      point,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });
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

  #actionViewHandler = async (actionType, updateType, update) => {

    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointComponent.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointComponent.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#currentFilterType = 'ERROR';
        this.#clearBoard();
        this.#renderNoPoint();
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
    this.#newPointComponent.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer);
  }

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.points.length === 0) {
      this.#renderNoPoint();
      return;
    }

    this.#renderSort();
    this.#renderPointContainer();
    this.#renderPoints();
  };

  #clearBoard({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#newPointComponent.destroy();
    this.#pointPresenters.clear();

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderNoPoint() {
    this.#noPointComponent = new NoPointView({
      currentFilterType: this.#currentFilterType
    });

    render(this.#noPointComponent, this.#boardContainer);
  }

}
