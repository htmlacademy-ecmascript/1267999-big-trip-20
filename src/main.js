import { render } from './render.js';
import TripInfoView from './view/trip-info-view.js';
import TripFiltersView from './view/trip-filters-view.js';
import NewEventButtonView from './view/new-event-button-view.js';
import BoardPresenter from './presenter/board-presenter.js';

const siteMainElement = document.querySelector('.trip-main');
const siteTripEventElement = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({boardContainer: siteTripEventElement});

render(new TripInfoView(), siteMainElement);
render(new TripFiltersView(), siteMainElement);
render(new NewEventButtonView(), siteMainElement);
boardPresenter.init();
