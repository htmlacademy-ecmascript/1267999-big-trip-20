import {render} from './framework/render.js';
import TripInfoView from './view/trip-info-view.js';
import NewPointButtonView from './view/new-point-button-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';

import MockService from './service/mock-service.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';

const siteMainElement = document.querySelector('.trip-main');
const siteTripPointElement = document.querySelector('.trip-events');

const mockService = new MockService();
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);

const filterPresenter = new FilterPresenter({
  container: siteMainElement,
  pointsModel
});

const boardPresenter = new BoardPresenter({
  boardContainer: siteTripPointElement,
  destinationsModel,
  offersModel,
  pointsModel
});

render(new TripInfoView(), siteMainElement);
filterPresenter.init();
render(new NewPointButtonView(), siteMainElement);
boardPresenter.init();
