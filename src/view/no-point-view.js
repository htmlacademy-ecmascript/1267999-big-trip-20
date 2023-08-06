import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';


const noPointsText = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
};


function createNoPointTemplate(currentFilterType) {
  const noPointText = noPointsText[currentFilterType];
  return (`
    <p class="trip-events__msg">${noPointText}</p>
  `);
}

export default class NoPointView extends AbstractView {
  #currentFilterType = null;

  constructor({currentFilterType}) {
    super();
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createNoPointTemplate(this.#currentFilterType);
  }
}
