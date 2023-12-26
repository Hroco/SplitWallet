describe("Basic Test", () => {
  beforeEach(() => {
    // This code will run before each test in this describe block
    cy.visit("http://localhost:3000/");
    cy.viewport(412, 915);
    cy.clearAllCookies();

    // indexedDB.deleteDatabase('name_of_your_database');
  });

  it("Create New Wallet", () => {
    cy.url().should("include", "/");

    cy.get('[data-test-target="addButton"]').click();

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
