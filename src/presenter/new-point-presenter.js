import {remove, render, RenderPosition} from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import {UserAction, UpdateType} from '../const.js';

export default class NewPointPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;

  #handleDataChange = null;
  #handleDestroy = null;

  #pointEditComponent = null;

  constructor({container, onDataChange, onDestroy}) {
    this.#container = container;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init({destinationsModel, offersModel}) {
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new PointEditView({
      pointDestinations: this.#destinationsModel.destinations,
      allOffers: this.#offersModel.offers,
      onSubmitClick: this.#formSubmitHandler,
      onDeleteClick: this.#deleteClickHandler,
      isEditMode: false
    });

    render(this.#pointEditComponent, this.#container, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
      isEditMode: false
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #formSubmitHandler = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      {point},
    );
    this.destroy();
  };

  #deleteClickHandler = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
