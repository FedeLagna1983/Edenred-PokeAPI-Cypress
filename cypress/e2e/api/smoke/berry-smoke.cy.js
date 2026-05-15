describe("PokeAPI Smoke Suite", () => {
  it(
    "[SMOKE][REGRESSION] [API][Berry] should return 200 and expected payload when requesting berry by valid id (1)",
    { tags: ["@smoke"] },
    () => {
    cy.request("/berry/1/").then((response) => {
      expect(response.status).to.equal(200);
      expect(response.headers["content-type"]).to.include("application/json");
      expect(response.body).to.be.an("object");
      expect(response.body.id).to.equal(1);
      expect(response.body.name).to.equal("cheri");
    });
    }
  );

  it(
    "[SMOKE][REGRESSION] [API][Berry] should return 404 Not found when requesting berry by invalid id (0)",
    { tags: ["@smoke"] },
    () => {
    cy.request({
      url: "/berry/0/",
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(404);
      const contentType = response.headers["content-type"] || "";
      expect(contentType).to.match(/application\/json|text\/plain/i);

      const errorMessage =
        typeof response.body === "string" ? response.body : response.body.detail;
      expect(errorMessage.toLowerCase()).to.include("not found");
    });
    }
  );

  it(
    "[SMOKE][REGRESSION] [API][Berry-Flavor] should return 200 and berries list when requesting flavor by valid name (spicy)",
    { tags: ["@smoke"] },
    () => {
    cy.request("/berry-flavor/spicy/").then((response) => {
      expect(response.status).to.equal(200);
      expect(response.headers["content-type"]).to.include("application/json");
      expect(response.body).to.be.an("object");
      expect(response.body.name).to.equal("spicy");
      expect(response.body.berries).to.be.an("array").and.not.be.empty;
    });
    }
  );

  it(
    "[SMOKE][REGRESSION] [API][Berry-Flavor->Berry] should fetch highest-potency spicy berry and return consistent berry details",
    { tags: ["@smoke"] },
    () => {
    cy.request("/berry-flavor/spicy/").then((flavorResponse) => {
      expect(flavorResponse.status).to.equal(200);
      expect(flavorResponse.headers["content-type"]).to.include("application/json");
      expect(flavorResponse.body.name).to.equal("spicy");
      expect(flavorResponse.body.berries).to.be.an("array").and.not.be.empty;

      const berries = flavorResponse.body.berries;
      const maxPotency = Math.max(...berries.map((entry) => entry.potency));
      const tiedBerries = berries
        .filter((entry) => entry.potency === maxPotency)
        .sort((a, b) => a.berry.name.localeCompare(b.berry.name));
      const selectedBerry = tiedBerries[0];

      expect(selectedBerry).to.exist;
      expect(selectedBerry.berry.name).to.be.a("string").and.not.be.empty;

      cy.request(`/berry/${selectedBerry.berry.name}/`).then((berryResponse) => {
        expect(berryResponse.status).to.equal(200);
        expect(berryResponse.headers["content-type"]).to.include("application/json");
        expect(berryResponse.body.name).to.equal(selectedBerry.berry.name);

        const spicyFlavor = berryResponse.body.flavors.find(
          (entry) => entry.flavor.name === "spicy"
        );

        expect(spicyFlavor, "spicy flavor exists in berry details").to.exist;
        expect(spicyFlavor.potency).to.equal(selectedBerry.potency);
      });
    });
    }
  );
});
