describe("Basic Test", () => {
  beforeEach(() => {
    // This code will run before each test in this describe block
    cy.visit("http://localhost:3000/");
    cy.viewport(412, 915);
  });

  after(() => {
    // This code will run after all tests
    cy.window()
      .its("clearDB")
      .then((clearDB) => {
        clearDB();

        cy.visit("http://localhost:3000/");
      });
  });

  it("Create New Wallet", () => {
    cy.url().should("include", "/");

    cy.get('[data-test-target="addButton"]', { timeout: 10000 })
      .should("be.visible")
      .click();

    cy.get('[data-test-target="newWalletTitle"]').type("Pohoda 2023");

    cy.get('[data-test-target="newWalletDescription"]').type(
      "Best action ever"
    );

    cy.get('[data-test-target="newWalletCurrency"]').click();

    cy.contains(".alert-radio-group > button", "Usd").click();

    cy.contains(".alert-button-group > button", "OK").click();

    cy.get('[data-test-target="newWalletCategorySharedHouse"]').click();

    cy.get('[data-test-target="newWalletParticipantName0"]').type("Samo");

    cy.get('[data-test-target="newWalletParticipantName1"]').type("Isi");

    cy.get('[data-test-target="newWalletParticipantName2"]').type("Jakub");

    cy.get('[data-test-target="newWalletParticipantName3"]').type("Claudia");

    cy.get('[data-test-target="addNewWallet"]').click();
  });
});
