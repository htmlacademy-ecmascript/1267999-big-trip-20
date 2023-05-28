export default class DestinationsModel {
  constructor(service) {
    this.service = service;
    this.Destinations = this.service.getDestinations();
  }

  getDestinations() {
    return this.Destinations;
  }

  getById(id) {
    return this.Destinations
      .find((destination) => destination.id === id);
  }
}
