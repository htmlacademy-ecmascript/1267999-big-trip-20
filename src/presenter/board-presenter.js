import {render} from '../render.js';
import TripSortEventView from '../view/trip-sort-event-view.js';
import EventListView from '../view/event-list-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventDefaultView from '../view/event-default-view.js';

export default class BoardPresenter {
  boardSortEventComponent = new TripSortEventView();
  eventListComponent = new EventListView();
  eventEditView = new EventEditView();

  constructor({boardContainer, destinationsModel, offersModel, pointsModel}) {
    this.boardContainer = boardContainer;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
    this.pointsModel = pointsModel;
    this.points = [...pointsModel.get()];
  }

  init() {
    render(this.boardSortEventComponent, this.boardContainer);
    render(this.eventListComponent, this.boardContainer);
    render(
      new EventEditView({
        point: this.points[0],
        pointDestinations: this.destinationsModel.get(),
        pointOffers: this.offersModel.get()
      }), this.eventListComponent.getElement());

    this.points.forEach((point) => {
      render(
        new EventDefaultView({
          point,
          pointDestination: this.destinationsModel.getById(point.destination),
          pointOffers: this.offersModel.getByType(point.type)
        }), this.eventListComponent.getElement());
    });
  }
}
