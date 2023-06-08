import {render} from './framework/render.js';
import TripInfoView from './view/trip-info-view.js';
import TripFiltersView from './view/trip-filters-view.js';
import NewEventButtonView from './view/new-event-button-view.js';
import BoardPresenter from './presenter/board-presenter.js';

import MockService from './service/mock-service.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';

const siteMainElement = document.querySelector('.trip-main');
const siteTripEventElement = document.querySelector('.trip-events');

const mockService = new MockService();
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);

const boardPresenter = new BoardPresenter({
  boardContainer: siteTripEventElement,
  destinationsModel,
  offersModel,
  pointsModel
});

render(new TripInfoView(), siteMainElement);
render(new TripFiltersView(), siteMainElement);
render(new NewEventButtonView(), siteMainElement);
boardPresenter.init();
