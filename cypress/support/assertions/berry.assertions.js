const { expectJsonResponse } = require("./http.assertions");

const BERRY_SCHEMA_KEYS = [
  "firmness",
  "flavors",
  "growth_time",
  "id",
  "item",
  "max_harvest",
  "name",
  "natural_gift_power",
  "natural_gift_type",
  "size",
  "smoothness",
  "soil_dryness"
];

const expectBerrySummary = (response, expectedBerry) => {
  expectJsonResponse(response);
  expect(response.body).to.be.an("object");
  expect(response.body.id).to.equal(expectedBerry.id);
  expect(response.body.name).to.equal(expectedBerry.name);
};

const expectBerryDetails = (response, expectedBerry) => {
  expectBerrySummary(response, expectedBerry);
  expect(response.body).to.have.all.keys(...BERRY_SCHEMA_KEYS);
  expect(response.body.growth_time).to.be.a("number");
  expect(response.body.max_harvest).to.be.a("number");
  expect(response.body.size).to.be.a("number");
  expect(response.body.smoothness).to.be.a("number");
  expect(response.body.soil_dryness).to.be.a("number");
};

const expectBerryFlavor = (response, expectedFlavorName) => {
  expectJsonResponse(response);
  expect(response.body).to.be.an("object");
  expect(response.body.name).to.equal(expectedFlavorName);
  expect(response.body.berries).to.be.an("array").and.not.be.empty;
};

const expectBerryFlavorEntries = (berries) => {
  berries.forEach((entry) => {
    expect(entry.potency).to.be.a("number").and.to.be.at.least(0);
    expect(entry.berry.name).to.be.a("string").and.not.be.empty;
    expect(entry.berry.url).to.be.a("string").and.include("/api/v2/berry/");
  });
};

const selectHighestPotencyBerry = (berries) => {
  const maxPotency = Math.max(...berries.map((entry) => entry.potency));

  return berries
    .filter((entry) => entry.potency === maxPotency)
    .sort((a, b) => a.berry.name.localeCompare(b.berry.name))[0];
};

const expectBerryHasFlavorPotency = (berryResponse, flavorName, expectedPotency) => {
  const flavor = berryResponse.body.flavors.find((entry) => entry.flavor.name === flavorName);

  expect(flavor, `${flavorName} flavor exists in berry details`).to.exist;
  expect(flavor.potency).to.equal(expectedPotency);
};

module.exports = {
  expectBerryDetails,
  expectBerryFlavor,
  expectBerryFlavorEntries,
  expectBerryHasFlavorPotency,
  expectBerrySummary,
  selectHighestPotencyBerry
};
