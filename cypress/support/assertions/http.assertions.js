const expectJsonResponse = (response, expectedStatus = 200) => {
  expect(response.status).to.equal(expectedStatus);
  expect(response.headers["content-type"]).to.include("application/json");
};

const expectNotFoundResponse = (response) => {
  expect(response.status).to.equal(404);

  const contentType = response.headers["content-type"] || "";
  expect(contentType).to.match(/application\/json|text\/plain/i);

  const errorMessage = typeof response.body === "string" ? response.body : response.body.detail;
  expect(errorMessage.toLowerCase()).to.include("not found");
};

module.exports = {
  expectJsonResponse,
  expectNotFoundResponse
};
