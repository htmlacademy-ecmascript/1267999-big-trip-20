import AbstractView from '../framework/view/abstract-view.js';
import {noPointMessage} from '../const.js';


function createNoPointTemplate(currentFilterType) {
  const noPointText = noPointMessage[currentFilterType];

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
