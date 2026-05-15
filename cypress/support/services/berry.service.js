const { pokeApiClient } = require("../api/pokeapi.client");

const normalizedPath = (resource, value) => `/${resource}/${value}/`;

const berryService = {
  getBerryById(id) {
    return pokeApiClient.get(normalizedPath("berry", id));
  },

  getBerryByName(name) {
    return pokeApiClient.get(normalizedPath("berry", name));
  },

  getBerryByIdAllowingFailure(id) {
    return pokeApiClient.getAllowingFailure(normalizedPath("berry", id));
  },

  getBerryByNameAllowingFailure(name) {
    return pokeApiClient.getAllowingFailure(normalizedPath("berry", name));
  },

  getBerryFlavorByName(name) {
    return pokeApiClient.get(normalizedPath("berry-flavor", name));
  }
};

module.exports = { berryService };
