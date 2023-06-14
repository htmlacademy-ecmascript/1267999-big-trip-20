import {render, replace} from '../framework/render.js';
import TripSortPointView from '../view/trip-sort-point-view.js';
import PointListView from '../view/point-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';

export default class BoardPresenter {
  #boardContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #points = null;
  #boardSortPointComponent = new TripSortPointView();
  #pointListComponent = new PointListView();

  constructor({boardContainer, destinationsModel, offersModel, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#points = [...this.#pointsModel.points];
  }

  init() {
    render(this.#boardSortPointComponent, this.#boardContainer);
    render(this.#pointListComponent, this.#boardContainer);
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint = (point) => {
    const pointComponent = new PointView({
      point,
      pointDestination: this.#destinationsModel.getById(point.destination),
      pointOffersByType: this.#offersModel.getByType(point.type),
      onEditClick: pointEditClickHandler
    });

    const pointEditComponent = new PointEditView({
      point: this.#points[0],
      pointDestinations: this.#destinationsModel.destinations,
      pointOffers: this.#offersModel.offers,
      onResetClick: resetButtonClickHandler,
      onSubmitClick: pointSubmitHandler
    });

    const replacePointToForm = () => {
      replace(pointEditComponent, pointComponent);
    };

    const replaceFormToPoint = () => {
      replace(pointComponent, pointEditComponent);
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    function pointEditClickHandler() {
      replacePointToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    }

    function resetButtonClickHandler() {
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    function pointSubmitHandler() {
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    render(pointComponent, this.#pointListComponent.element);
  };
}
