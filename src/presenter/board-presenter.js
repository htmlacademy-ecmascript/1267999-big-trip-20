import {render} from '../render.js';
import TripSortEventView from '../view/trip-sort-event-view.js';
import EventListView from '../view/event-list-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventDefaultView from '../view/event-default-view.js';

export default class BoardPresenter {
  boardSortEventComponent = new TripSortEventView();
  eventListComponent = new EventListView();
  eventEditView = new EventEditView();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(this.boardSortEventComponent, this.boardContainer);
    render(this.eventListComponent, this.boardContainer);
    render(this.eventEditView, this.eventListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new EventDefaultView(), this.eventListComponent.getElement());
    }

  }
}
