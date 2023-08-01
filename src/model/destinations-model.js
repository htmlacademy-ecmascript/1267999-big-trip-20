import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class DestinationsModel extends Observable {
  #pointsApiService = null;
  #destinations = null;


  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#pointsApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  }

  getById(id) {
    return this.#destinations
      .find((destination) => destination.id === id);
  }
}
