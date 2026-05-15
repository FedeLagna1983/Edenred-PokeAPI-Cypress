class PokeApiClient {
  request(path, options = {}) {
    return cy.request({
      url: path,
      ...options
    });
  }

  get(path) {
    return this.request(path);
  }

  getAllowingFailure(path) {
    return this.request(path, { failOnStatusCode: false });
  }
}

module.exports = {
  pokeApiClient: new PokeApiClient()
};
