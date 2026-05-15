const testData = require("../../../fixtures/pokeapi-test-data.json");
const { expectNotFoundResponse } = require("../../../support/assertions/http.assertions");
const {
  expectBerryFlavor,
  expectBerryHasFlavorPotency,
  expectBerrySummary,
  selectHighestPotencyBerry
} = require("../../../support/assertions/berry.assertions");
const { berryService } = require("../../../support/services/berry.service");

const { berry, flavor } = testData;
const validBerry = { id: berry.validId, name: berry.validName };

describe("PokeAPI Smoke Suite", () => {
  it(
    "[SMOKE] [API][Berry] should return 200 and expected payload when requesting berry by valid id (1)",
    { tags: ["@smoke"] },
    () => {
      berryService.getBerryById(berry.validId).then((response) => {
        expectBerrySummary(response, validBerry);
      });
    }
  );

  it(
    "[SMOKE] [API][Berry] should return 404 Not found when requesting berry by invalid id (0)",
    { tags: ["@smoke"] },
    () => {
      berryService.getBerryByIdAllowingFailure(berry.invalidId).then(expectNotFoundResponse);
    }
  );

  it(
    "[SMOKE] [API][Berry-Flavor] should return 200 and berries list when requesting flavor by valid name (spicy)",
    { tags: ["@smoke"] },
    () => {
      berryService.getBerryFlavorByName(flavor.validName).then((response) => {
        expectBerryFlavor(response, flavor.validName);
      });
    }
  );

  it(
    "[SMOKE] [API][Berry-Flavor->Berry] should fetch highest-potency spicy berry and return consistent berry details",
    { tags: ["@smoke"] },
    () => {
      berryService.getBerryFlavorByName(flavor.validName).then((flavorResponse) => {
        expectBerryFlavor(flavorResponse, flavor.validName);

        const selectedBerry = selectHighestPotencyBerry(flavorResponse.body.berries);
        expect(selectedBerry.berry.name).to.be.a("string").and.not.be.empty;

        berryService.getBerryByName(selectedBerry.berry.name).then((berryResponse) => {
          expectBerrySummary(berryResponse, { name: selectedBerry.berry.name, id: berryResponse.body.id });
          expectBerryHasFlavorPotency(berryResponse, flavor.validName, selectedBerry.potency);
        });
      });
    }
  );
});

