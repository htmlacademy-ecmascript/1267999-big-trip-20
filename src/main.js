import {render} from './framework/render.js';
import TripInfoView from './view/trip-info-view.js';
import NewPointButtonView from './view/new-point-button-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';

import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './point-api-service.js';

import {AUTHORIZATION, END_POINT} from './const.js';

const siteMainElement = document.querySelector('.trip-main');
const siteTripPointElement = document.querySelector('.trip-events');
const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const destinationsModel = new DestinationsModel({pointsApiService});
const offersModel = new OffersModel({pointsApiService});
const pointsModel = new PointsModel({pointsApiService});
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

Promise.all([offersModel.init(), destinationsModel.init()])
  .then(() => pointsModel.init()
    .finally(() => {
      render(newPointButtonComponent, siteMainElement);
    }))
  .then(() => {
    boardPresenter.init();
  });
