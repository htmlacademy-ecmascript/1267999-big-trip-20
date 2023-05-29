import {render} from '../render.js';
import TripSortEventView from '../view/trip-sort-event-view.js';
import EventListView from '../view/event-list-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventView from '../view/event-view.js';

export default class BoardPresenter {
  boardSortEventComponent = new TripSortEventView();
  eventListComponent = new EventListView();

  constructor({boardContainer, destinationsModel, offersModel, pointsModel}) {
    this.boardContainer = boardContainer;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
    this.pointsModel = pointsModel;
    this.points = [...this.pointsModel.getPoints()];
  }

  init() {
    render(this.boardSortEventComponent, this.boardContainer);
    render(this.eventListComponent, this.boardContainer);
    render(
      new EventEditView({
        point: this.points[0],
        pointDestinations: this.destinationsModel.getDestinations(),
        pointOffers: this.offersModel.getOffers()
      }), this.eventListComponent.getElement());

    this.points.forEach((point) => {
      render(
        new EventView({
          point,
          pointDestination: this.destinationsModel.getById(point.destination),
          pointOffersByType: this.offersModel.getByType(point.type)
        }), this.eventListComponent.getElement());
    });
  }
}
