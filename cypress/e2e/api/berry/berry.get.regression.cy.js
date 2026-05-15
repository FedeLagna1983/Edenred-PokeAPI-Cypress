const testData = require("../../../fixtures/pokeapi-test-data.json");
const { expectNotFoundResponse } = require("../../../support/assertions/http.assertions");
const {
  expectBerryDetails,
  expectBerryFlavor,
  expectBerryFlavorEntries,
  expectBerryHasFlavorPotency,
  expectBerrySummary,
  selectHighestPotencyBerry
} = require("../../../support/assertions/berry.assertions");
const { berryService } = require("../../../support/services/berry.service");

const { berry, flavor } = testData;
const validBerry = { id: berry.validId, name: berry.validName };

describe("PokeAPI Regression Suite", () => {
  it(
    "[REGRESSION] [API][Berry] should return 200 and expected payload when requesting berry by valid id (1)",
    { tags: ["@regression"] },
    () => {
      berryService.getBerryById(berry.validId).then((response) => {
        expectBerryDetails(response, validBerry);
      });
    }
  );

  it(
    "[REGRESSION] [API][Berry] should return 404 Not found when requesting berry by invalid id (0)",
    { tags: ["@regression"] },
    () => {
      berryService.getBerryByIdAllowingFailure(berry.invalidId).then(expectNotFoundResponse);
    }
  );

  it(
    "[REGRESSION] [API][Berry] should return 200 and expected payload when requesting berry by valid name (cheri)",
    { tags: ["@regression"] },
    () => {
      berryService.getBerryByName(berry.validName).then((response) => {
        expectBerryDetails(response, validBerry);
      });
    }
  );

  it(
    "[REGRESSION] [API][Berry] should return 404 Not found when requesting berry by invalid name (berry-invalida-qa)",
    { tags: ["@regression"] },
    () => {
      berryService.getBerryByNameAllowingFailure(berry.invalidName).then(expectNotFoundResponse);
    }
  );

  it(
    "[REGRESSION] [API][Berry-Flavor] should return 200 and berries list when requesting flavor by valid name (spicy)",
    { tags: ["@regression"] },
    () => {
      berryService.getBerryFlavorByName(flavor.validName).then((response) => {
        expectBerryFlavor(response, flavor.validName);
        expectBerryFlavorEntries(response.body.berries);
      });
    }
  );

  it(
    "[REGRESSION] [API][Berry-Flavor->Berry] should fetch highest-potency spicy berry and return consistent berry details",
    { tags: ["@regression"] },
    () => {
      berryService.getBerryFlavorByName(flavor.validName).then((flavorResponse) => {
        expectBerryFlavor(flavorResponse, flavor.validName);

        const selectedBerry = selectHighestPotencyBerry(flavorResponse.body.berries);
        const existsInFlavorList = flavorResponse.body.berries.some(
          (entry) => entry.berry.name === selectedBerry.berry.name
        );

        expect(selectedBerry.berry.name).to.be.a("string").and.not.be.empty;
        expect(existsInFlavorList).to.equal(true);

        berryService.getBerryByName(selectedBerry.berry.name).then((berryResponse) => {
          expectBerrySummary(berryResponse, { name: selectedBerry.berry.name, id: berryResponse.body.id });
          expectBerryHasFlavorPotency(berryResponse, flavor.validName, selectedBerry.potency);
        });
      });
    }
  );
});

