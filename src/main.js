import {render} from './framework/render.js';
import TripInfoView from './view/trip-info-view.js';
import NewPointButtonView from './view/new-point-button-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';

import MockService from './service/mock-service.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

const siteMainElement = document.querySelector('.trip-main');
const siteTripPointElement = document.querySelector('.trip-events');

const mockService = new MockService();
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filterContainer: siteMainElement,
  filterModel,
  pointsModel
});

const boardPresenter = new BoardPresenter({
  boardContainer: siteTripPointElement,
  destinationsModel,
  offersModel,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}


render(new TripInfoView(), siteMainElement);
filterPresenter.init();
render(newPointButtonComponent, siteMainElement);
boardPresenter.init();
