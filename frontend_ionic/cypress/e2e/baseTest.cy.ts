import { should } from "chai";
import { get } from "cypress/types/lodash";

enum ID {
  NEW_WALLET_TITLE = "newWalletTitle",
  NEW_WALLET_DESCRIPTION = "newWalletDescription",
  NEW_WALLET_CURRENCY = "newWalletCurrency",
  NEW_WALLET_CATEGORY_SHARED_HOUSE = "newWalletCategorySharedHouse",
  NEW_WALLET_CATEGORY_TRIP = "newWalletCategoryTrip",
  NEW_WALLET_PARTICIPANT_NAME = "newWalletParticipantName",
  ADD_NEW_WALLET = "addNewWallet",
  ADD_BUTTON = "addButton",
  WALLET_NAME = "walletName",
  WALLET_DESCRIPTION = "walletDescription",
  WALLET_BUTTON = "walletButton",
  ADD_ITEM_BUTTON = "addItemButton",
  NEW_WALLET_ITEM_TYPE = "newWalletItemType",
  NEW_WALLET_ITEM_TITLE = "newWalletItemTitle",
  NEW_WALLET_ITEM_AMOUNT = "newWalletItemAmount",
  NEW_WALLET_ITEM_DATE = "newWalletItemDate",
  NEW_WALLET_ITEM_PAYER = "newWalletItemPayer",
  NEW_WALLET_ITEM_USER_CHECKBOX = "newWalletItemUserCheckbox",
  NEW_WALLET_ITEM_USER_NAME = "newWalletItemUserName",
  NEW_WALLET_ITEM_USER_VALUE = "newWalletItemUserValue",
  ADD_NEW_WALLET_ITEM = "addNewWalletItem",
  CURRENT_USER_TOTAL = "currentUserTotal",
  WALLET_TOTAL = "walletTotal",
  EXPENSES_BUTTON = "expenseButton",
  BALANCES_BUTTON = "balancesButton",
  BALANCES_ITEM_LEFT = "balancesItemLeft",
  BALANCES_ITEM_RIGHT = "balancesItemRight",
  REINBURSEMENT_ITEM_PAYER = "reinbursementItemPayer",
  REINBURSEMENT_ITEM_DEBTOR = "reinbursementItemDebtor",
  REINBURSEMENT_ITEM_AMOUNT = "reinbursementItemAmount",
}

function getElementById(id: ID) {
  return cy.get(`[data-test-target="${id}"]`);
}

function getDynamicElementById(id: ID, index: number) {
  return cy.get(`[data-test-target="${id}${index}"]`);
}

function getListOfTables() {
  const listOfTables = new Promise((resolve, reject) => {
    cy.window()
      .its("listOfTables")
      .then((listOfTables) => {
        resolve(listOfTables());
      });
  });

  return cy.wrap(listOfTables);
}

function clearLocalDatabase() {
  cy.window()
    .its("clearDB")
    .then((clearDB) => {
      clearDB();

      cy.visit("http://localhost:3000/");
    });
}

describe("Basic Test", () => {
  beforeEach(() => {
    // This code will run before each test in this describe block
    cy.visit("http://localhost:3000/");

    clearLocalDatabase();

    cy.viewport(412, 915);

    getListOfTables().its("listOfWallets").should("have.length", 0);
  });

  /*after(() => {
    // This code will run after all tests
    clearLocalDatabase();
  });*/

  /*it("Create New Wallet", () => {
    cy.url().should("include", "/");

    getElementById(ID.ADD_BUTTON).should("be.visible").click();

    getElementById(ID.NEW_WALLET_TITLE)
      .type("Pohoda 2023")
      .should("have.value", "Pohoda 2023");

    getElementById(ID.NEW_WALLET_DESCRIPTION)
      .type("Best action ever")
      .should("have.value", "Best action ever");

    getElementById(ID.NEW_WALLET_CURRENCY).click();

    cy.contains(".alert-radio-group > button", "Usd").click();

    cy.contains(".alert-button-group > button", "OK").click();

    getElementById(ID.NEW_WALLET_CURRENCY).should("have.value", "usd");

    getElementById(ID.NEW_WALLET_CATEGORY_SHARED_HOUSE).click();

    getDynamicElementById(ID.NEW_WALLET_PARTICIPANT_NAME, 0)
      .type("Samo")
      .should("have.value", "Samo");

    getDynamicElementById(ID.NEW_WALLET_PARTICIPANT_NAME, 1)
      .type("Isi")
      .should("have.value", "Isi");

    getDynamicElementById(ID.NEW_WALLET_PARTICIPANT_NAME, 2)
      .type("Jakub")
      .should("have.value", "Jakub");

    getDynamicElementById(ID.NEW_WALLET_PARTICIPANT_NAME, 3)
      .type("Claudia")
      .should("have.value", "Claudia");

    getElementById(ID.ADD_NEW_WALLET).click();

    getListOfTables()
      .its("listOfWallets")
      .should("have.length", 1)
      .then((listOfWallets) => {
        console.log(listOfWallets);
        expect(listOfWallets[0].name).to.equal("Pohoda 2023");
        expect(listOfWallets[0].description).to.equal("Best action ever");
        expect(listOfWallets[0].currency).to.equal("usd");
        expect(listOfWallets[0].category).to.equal("sharedHouse");
        expect(listOfWallets[0].walletUsers).to.have.length(4);
        expect(listOfWallets[0].walletItems).to.have.length(0);
      });

    getListOfTables()
      .its("listOfWalletUsers")
      .should("have.length", 4)
      .then((listOfWalletUsers) => {
        console.log(listOfWalletUsers);
        expect(listOfWalletUsers[0].name).to.equal("Samo");
        expect(listOfWalletUsers[0].bilance).to.equal(0);
        expect(listOfWalletUsers[0].total).to.equal(0);
        expect(listOfWalletUsers[0].walletItems).to.have.length(0);
        expect(listOfWalletUsers[0].recieverData).to.have.length(0);

        expect(listOfWalletUsers[1].name).to.equal("Isi");
        expect(listOfWalletUsers[1].bilance).to.equal(0);
        expect(listOfWalletUsers[1].total).to.equal(0);
        expect(listOfWalletUsers[1].walletItems).to.have.length(0);
        expect(listOfWalletUsers[1].recieverData).to.have.length(0);

        expect(listOfWalletUsers[2].name).to.equal("Jakub");
        expect(listOfWalletUsers[2].bilance).to.equal(0);
        expect(listOfWalletUsers[2].total).to.equal(0);
        expect(listOfWalletUsers[2].walletItems).to.have.length(0);
        expect(listOfWalletUsers[2].recieverData).to.have.length(0);

        expect(listOfWalletUsers[3].name).to.equal("Claudia");
        expect(listOfWalletUsers[3].bilance).to.equal(0);
        expect(listOfWalletUsers[3].total).to.equal(0);
        expect(listOfWalletUsers[3].walletItems).to.have.length(0);
        expect(listOfWalletUsers[3].recieverData).to.have.length(0);
      });

    getElementById(ID.ADD_BUTTON).click();

    getElementById(ID.NEW_WALLET_TITLE).type("Grappe 2023");

    getElementById(ID.NEW_WALLET_DESCRIPTION).type("Best action ever 2");

    getElementById(ID.NEW_WALLET_CURRENCY).click();

    cy.contains(".alert-radio-group > button", "Eur").click();

    cy.contains(".alert-button-group > button", "OK").click();

    getElementById(ID.NEW_WALLET_CATEGORY_SHARED_HOUSE).click();

    getDynamicElementById(ID.NEW_WALLET_PARTICIPANT_NAME, 0).type("Samo");

    getDynamicElementById(ID.NEW_WALLET_PARTICIPANT_NAME, 1).type("Isi");

    getDynamicElementById(ID.NEW_WALLET_PARTICIPANT_NAME, 2).type("Peto");

    getDynamicElementById(ID.NEW_WALLET_PARTICIPANT_NAME, 3).type("Lepis");

    getElementById(ID.ADD_NEW_WALLET).click();

    getListOfTables().its("listOfWallets").should("have.length", 2);

    getDynamicElementById(ID.WALLET_NAME, 0).should("have.text", "Grappe 2023");
    getDynamicElementById(ID.WALLET_DESCRIPTION, 0).should(
      "have.text",
      "Best action ever 2"
    );

    getDynamicElementById(ID.WALLET_NAME, 1).should("have.text", "Pohoda 2023");
    getDynamicElementById(ID.WALLET_DESCRIPTION, 1).should(
      "have.text",
      "Best action ever"
    );
  });*/

  it("Grappe Test", () => {
    getElementById(ID.ADD_BUTTON).click();

    getElementById(ID.NEW_WALLET_TITLE).type("Grappe Test");

    getElementById(ID.NEW_WALLET_DESCRIPTION).type("Test grappe");

    getElementById(ID.NEW_WALLET_CURRENCY).click();

    cy.contains(".alert-radio-group > button", "Eur").click();
    cy.contains(".alert-button-group > button", "OK").click();

    getElementById(ID.NEW_WALLET_CATEGORY_TRIP).click();

    getDynamicElementById(ID.NEW_WALLET_PARTICIPANT_NAME, 0).type("Samo");
    getDynamicElementById(ID.NEW_WALLET_PARTICIPANT_NAME, 1).type("Isi");
    getDynamicElementById(ID.NEW_WALLET_PARTICIPANT_NAME, 2).type("Jakub");
    getDynamicElementById(ID.NEW_WALLET_PARTICIPANT_NAME, 3).type("Claudia");
    getDynamicElementById(ID.NEW_WALLET_PARTICIPANT_NAME, 4).type("Lepis");
    getDynamicElementById(ID.NEW_WALLET_PARTICIPANT_NAME, 5).type("Matus");
    getDynamicElementById(ID.NEW_WALLET_PARTICIPANT_NAME, 6).type("Mrázik");
    getDynamicElementById(ID.NEW_WALLET_PARTICIPANT_NAME, 7).type("Adam");
    getDynamicElementById(ID.NEW_WALLET_PARTICIPANT_NAME, 8).type("Peto");
    getDynamicElementById(ID.NEW_WALLET_PARTICIPANT_NAME, 9).type("Sima");
    getDynamicElementById(ID.NEW_WALLET_PARTICIPANT_NAME, 10).type("Tupy");

    getElementById(ID.ADD_NEW_WALLET).click();

    getListOfTables().its("listOfWallets").should("have.length", 1);
    getListOfTables().its("listOfWalletUsers").should("have.length", 11);

    getDynamicElementById(ID.WALLET_NAME, 0).should("have.text", "Grappe Test");
    getDynamicElementById(ID.WALLET_DESCRIPTION, 0).should(
      "have.text",
      "Test grappe"
    );

    getDynamicElementById(ID.WALLET_BUTTON, 0).click();

    // Add new item
    getElementById(ID.ADD_ITEM_BUTTON).click();

    getElementById(ID.NEW_WALLET_ITEM_TITLE).type("Voda");
    getElementById(ID.NEW_WALLET_ITEM_AMOUNT).type("100");

    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 4).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 5).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 6).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 7).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 8).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 9).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 10).click();

    getElementById(ID.ADD_NEW_WALLET_ITEM).click();

    // Add second item
    getElementById(ID.ADD_ITEM_BUTTON).click();

    getElementById(ID.NEW_WALLET_ITEM_TITLE).type("Jedlo");
    getElementById(ID.NEW_WALLET_ITEM_AMOUNT).type("20");

    getElementById(ID.NEW_WALLET_ITEM_PAYER).click();
    cy.contains(".alert-radio-group > button", "Isi").click();
    cy.contains(".alert-button-group > button", "OK").click();

    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 4).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 5).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 6).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 7).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 8).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 9).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 10).click();

    getElementById(ID.ADD_NEW_WALLET_ITEM).click();

    // Add third item
    getElementById(ID.ADD_ITEM_BUTTON).click();

    getElementById(ID.NEW_WALLET_ITEM_TITLE).type("Nieco");
    getElementById(ID.NEW_WALLET_ITEM_AMOUNT).type("20");

    getElementById(ID.NEW_WALLET_ITEM_PAYER).click();
    cy.contains(".alert-radio-group > button", "Adam").click();
    cy.contains(".alert-button-group > button", "OK").click();

    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 1).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 2).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 3).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 4).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 5).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 6).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 7).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 8).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 9).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 10).click();

    getElementById(ID.ADD_NEW_WALLET_ITEM).click();

    // Add fourth item
    getElementById(ID.ADD_ITEM_BUTTON).click();

    getElementById(ID.NEW_WALLET_ITEM_TITLE).type("Nieco 2");
    getElementById(ID.NEW_WALLET_ITEM_AMOUNT).type("50");

    getElementById(ID.NEW_WALLET_ITEM_PAYER).click();
    cy.contains(".alert-radio-group > button", "Matus").click();
    cy.contains(".alert-button-group > button", "OK").click();

    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 0).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 1).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 2).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 3).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 4).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 5).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 7).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 8).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 9).click();

    getElementById(ID.ADD_NEW_WALLET_ITEM).click();

    // Add fifth item
    getElementById(ID.ADD_ITEM_BUTTON).click();

    getElementById(ID.NEW_WALLET_ITEM_TITLE).type("Nieco 3");
    getElementById(ID.NEW_WALLET_ITEM_AMOUNT).type("50");

    getElementById(ID.NEW_WALLET_ITEM_PAYER).click();
    cy.contains(".alert-radio-group > button", "Lepis").click();
    cy.contains(".alert-button-group > button", "OK").click();

    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 0).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 1).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 2).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 4).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 5).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 6).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 7).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 8).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 9).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 10).click();

    getElementById(ID.ADD_NEW_WALLET_ITEM).click();

    // Add sixth item
    getElementById(ID.ADD_ITEM_BUTTON).click();

    getElementById(ID.NEW_WALLET_ITEM_TITLE).type("Nieco 4");
    getElementById(ID.NEW_WALLET_ITEM_AMOUNT).type("100");

    getElementById(ID.NEW_WALLET_ITEM_PAYER).click();
    cy.contains(".alert-radio-group > button", "Peto").click();
    cy.contains(".alert-button-group > button", "OK").click();

    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 0).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 1).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 2).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 3).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 4).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 5).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 6).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 7).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 8).click();
    getDynamicElementById(ID.NEW_WALLET_ITEM_USER_CHECKBOX, 10).click();

    getElementById(ID.ADD_NEW_WALLET_ITEM).click();

    //Check Totals
    getElementById(ID.CURRENT_USER_TOTAL).should("have.text", "€ 50.00");
    getElementById(ID.WALLET_TOTAL).should("have.text", "€ 340.00");

    //Check DB Data
    getListOfTables()
      .its("listOfWallets")
      .should("have.length", 1)
      .then((listOfWallets) => {
        //console.log("listOfWallets", listOfWallets);
        expect(listOfWallets[0].name).to.equal("Grappe Test");
        expect(listOfWallets[0].description).to.equal("Test grappe");
        expect(listOfWallets[0].currency).to.equal("eur");
        expect(listOfWallets[0].category).to.equal("trip");
        expect(listOfWallets[0].walletUsers).to.have.length(11);
        expect(listOfWallets[0].walletItems).to.have.length(6);
      });

    getListOfTables()
      .its("listOfWalletUsers")
      .should("have.length", 11)
      .then((listOfWalletUsers) => {
        //console.log("listOfWalletUsers", listOfWalletUsers);
        expect(listOfWalletUsers[0].name).to.equal("Samo");
        expect(listOfWalletUsers[0].bilance).to.equal(50);
        expect(listOfWalletUsers[0].total).to.equal(50);
        expect(listOfWalletUsers[0].walletItems).to.have.length(1);
        expect(listOfWalletUsers[0].recieverData).to.have.length(3);

        expect(listOfWalletUsers[1].name).to.equal("Isi");
        expect(listOfWalletUsers[1].bilance).to.equal(-10);
        expect(listOfWalletUsers[1].total).to.equal(30);
        expect(listOfWalletUsers[1].walletItems).to.have.length(1);
        expect(listOfWalletUsers[1].recieverData).to.have.length(2);

        expect(listOfWalletUsers[2].name).to.equal("Jakub");
        expect(listOfWalletUsers[2].bilance).to.equal(-30);
        expect(listOfWalletUsers[2].total).to.equal(30);
        expect(listOfWalletUsers[2].walletItems).to.have.length(0);
        expect(listOfWalletUsers[2].recieverData).to.have.length(2);

        expect(listOfWalletUsers[3].name).to.equal("Claudia");
        expect(listOfWalletUsers[3].bilance).to.equal(-80);
        expect(listOfWalletUsers[3].total).to.equal(80);
        expect(listOfWalletUsers[3].walletItems).to.have.length(0);
        expect(listOfWalletUsers[3].recieverData).to.have.length(3);

        expect(listOfWalletUsers[4].name).to.equal("Lepis");
        expect(listOfWalletUsers[4].bilance).to.equal(50);
        expect(listOfWalletUsers[4].total).to.equal(0);
        expect(listOfWalletUsers[4].walletItems).to.have.length(1);
        expect(listOfWalletUsers[4].recieverData).to.have.length(0);

        expect(listOfWalletUsers[5].name).to.equal("Matus");
        expect(listOfWalletUsers[5].bilance).to.equal(50);
        expect(listOfWalletUsers[5].total).to.equal(0);
        expect(listOfWalletUsers[5].walletItems).to.have.length(1);
        expect(listOfWalletUsers[5].recieverData).to.have.length(0);

        expect(listOfWalletUsers[6].name).to.equal("Mrázik");
        expect(listOfWalletUsers[6].bilance).to.equal(-25);
        expect(listOfWalletUsers[6].total).to.equal(25);
        expect(listOfWalletUsers[6].walletItems).to.have.length(0);
        expect(listOfWalletUsers[6].recieverData).to.have.length(1);

        expect(listOfWalletUsers[7].name).to.equal("Adam");
        expect(listOfWalletUsers[7].bilance).to.equal(20);
        expect(listOfWalletUsers[7].total).to.equal(0);
        expect(listOfWalletUsers[7].walletItems).to.have.length(1);
        expect(listOfWalletUsers[7].recieverData).to.have.length(0);

        expect(listOfWalletUsers[8].name).to.equal("Peto");
        expect(listOfWalletUsers[8].bilance).to.equal(100);
        expect(listOfWalletUsers[8].total).to.equal(0);
        expect(listOfWalletUsers[8].walletItems).to.have.length(1);
        expect(listOfWalletUsers[8].recieverData).to.have.length(0);

        expect(listOfWalletUsers[9].name).to.equal("Sima");
        expect(listOfWalletUsers[9].bilance).to.equal(-100);
        expect(listOfWalletUsers[9].total).to.equal(100);
        expect(listOfWalletUsers[9].walletItems).to.have.length(0);
        expect(listOfWalletUsers[9].recieverData).to.have.length(1);

        expect(listOfWalletUsers[10].name).to.equal("Tupy");
        expect(listOfWalletUsers[10].bilance).to.equal(-25);
        expect(listOfWalletUsers[10].total).to.equal(25);
        expect(listOfWalletUsers[10].walletItems).to.have.length(0);
        expect(listOfWalletUsers[10].recieverData).to.have.length(1);
      });

    getListOfTables()
      .its("listOfWalletItems")
      .should("have.length", 6)
      .then((listOfWalletItems) => {
        //console.log("listOfWalletItems", listOfWalletItems);
        expect(listOfWalletItems[0].name).to.equal("Voda");
        expect(listOfWalletItems[0].amount).to.equal(100);
        expect(listOfWalletItems[0].type).to.equal("expense");
        expect(listOfWalletItems[0].payer.name).to.equal("Samo");
        expect(listOfWalletItems[0].Wallets.name).to.equal("Grappe Test");
        expect(listOfWalletItems[0].recievers).to.have.length(4);

        expect(listOfWalletItems[1].name).to.equal("Jedlo");
        expect(listOfWalletItems[1].amount).to.equal(20);
        expect(listOfWalletItems[1].type).to.equal("expense");
        expect(listOfWalletItems[1].payer.name).to.equal("Isi");
        expect(listOfWalletItems[1].Wallets.name).to.equal("Grappe Test");
        expect(listOfWalletItems[1].recievers).to.have.length(4);

        expect(listOfWalletItems[2].name).to.equal("Nieco");
        expect(listOfWalletItems[2].amount).to.equal(20);
        expect(listOfWalletItems[2].type).to.equal("expense");
        expect(listOfWalletItems[2].payer.name).to.equal("Adam");
        expect(listOfWalletItems[2].Wallets.name).to.equal("Grappe Test");
        expect(listOfWalletItems[2].recievers).to.have.length(1);

        expect(listOfWalletItems[3].name).to.equal("Nieco 2");
        expect(listOfWalletItems[3].amount).to.equal(50);
        expect(listOfWalletItems[3].type).to.equal("expense");
        expect(listOfWalletItems[3].payer.name).to.equal("Matus");
        expect(listOfWalletItems[3].Wallets.name).to.equal("Grappe Test");
        expect(listOfWalletItems[3].recievers).to.have.length(2);

        expect(listOfWalletItems[4].name).to.equal("Nieco 3");
        expect(listOfWalletItems[4].amount).to.equal(50);
        expect(listOfWalletItems[4].type).to.equal("expense");
        expect(listOfWalletItems[4].payer.name).to.equal("Lepis");
        expect(listOfWalletItems[4].Wallets.name).to.equal("Grappe Test");
        expect(listOfWalletItems[4].recievers).to.have.length(1);

        expect(listOfWalletItems[5].name).to.equal("Nieco 4");
        expect(listOfWalletItems[5].amount).to.equal(100);
        expect(listOfWalletItems[5].type).to.equal("expense");
        expect(listOfWalletItems[5].payer.name).to.equal("Peto");
        expect(listOfWalletItems[5].Wallets.name).to.equal("Grappe Test");
        expect(listOfWalletItems[5].recievers).to.have.length(1);
      });

    getListOfTables()
      .its("listOfRecieverData")
      .should("have.length", 13)
      .then((listOfRecieverData) => {
        //console.log("listOfRecieverData", listOfRecieverData);
        expect(listOfRecieverData[0].amount).to.equal(25);
        expect(listOfRecieverData[1].amount).to.equal(25);
        expect(listOfRecieverData[2].amount).to.equal(25);
        expect(listOfRecieverData[3].amount).to.equal(25);
        expect(listOfRecieverData[4].amount).to.equal(5);
        expect(listOfRecieverData[5].amount).to.equal(5);
        expect(listOfRecieverData[6].amount).to.equal(5);
        expect(listOfRecieverData[7].amount).to.equal(5);
        expect(listOfRecieverData[8].amount).to.equal(20);
        expect(listOfRecieverData[9].amount).to.equal(25);
        expect(listOfRecieverData[10].amount).to.equal(25);
        expect(listOfRecieverData[11].amount).to.equal(50);
        expect(listOfRecieverData[12].amount).to.equal(100);
      });

    getElementById(ID.BALANCES_BUTTON).click();

    //Check balances
    getDynamicElementById(ID.BALANCES_ITEM_RIGHT, 0).should(
      "have.text",
      "+€20.00"
    );
    getDynamicElementById(ID.BALANCES_ITEM_LEFT, 1).should(
      "have.text",
      "-€80.00"
    );
    getDynamicElementById(ID.BALANCES_ITEM_LEFT, 2).should(
      "have.text",
      "-€10.00"
    );
    getDynamicElementById(ID.BALANCES_ITEM_LEFT, 3).should(
      "have.text",
      "-€30.00"
    );
    getDynamicElementById(ID.BALANCES_ITEM_RIGHT, 4).should(
      "have.text",
      "+€50.00"
    );
    getDynamicElementById(ID.BALANCES_ITEM_RIGHT, 5).should(
      "have.text",
      "+€50.00"
    );
    getDynamicElementById(ID.BALANCES_ITEM_LEFT, 6).should(
      "have.text",
      "-€25.00"
    );
    getDynamicElementById(ID.BALANCES_ITEM_RIGHT, 7).should(
      "have.text",
      "+€100.00"
    );
    getDynamicElementById(ID.BALANCES_ITEM_RIGHT, 8).should(
      "have.text",
      "+€50.00"
    );
    getDynamicElementById(ID.BALANCES_ITEM_LEFT, 9).should(
      "have.text",
      "-€100.00"
    );
    getDynamicElementById(ID.BALANCES_ITEM_LEFT, 10).should(
      "have.text",
      "-€25.00"
    );

    //Check reinbursement
    //First reinbursement
    getDynamicElementById(ID.REINBURSEMENT_ITEM_PAYER, 0).should(
      "have.text",
      "Claudia"
    );
    getDynamicElementById(ID.REINBURSEMENT_ITEM_DEBTOR, 0).should(
      "have.text",
      "Adam"
    );
    getDynamicElementById(ID.REINBURSEMENT_ITEM_AMOUNT, 0).should(
      "have.text",
      "€20.00"
    );

    //Second reinbursement
    getDynamicElementById(ID.REINBURSEMENT_ITEM_PAYER, 1).should(
      "have.text",
      "Claudia"
    );
    getDynamicElementById(ID.REINBURSEMENT_ITEM_DEBTOR, 1).should(
      "have.text",
      "Lepis"
    );
    getDynamicElementById(ID.REINBURSEMENT_ITEM_AMOUNT, 1).should(
      "have.text",
      "€50.00"
    );

    //Third reinbursement
    getDynamicElementById(ID.REINBURSEMENT_ITEM_PAYER, 2).should(
      "have.text",
      "Claudia"
    );
    getDynamicElementById(ID.REINBURSEMENT_ITEM_DEBTOR, 2).should(
      "have.text",
      "Matus"
    );
    getDynamicElementById(ID.REINBURSEMENT_ITEM_AMOUNT, 2).should(
      "have.text",
      "€10.00"
    );

    //Fourth reinbursement
    getDynamicElementById(ID.REINBURSEMENT_ITEM_PAYER, 3).should(
      "have.text",
      "Isi"
    );
    getDynamicElementById(ID.REINBURSEMENT_ITEM_DEBTOR, 3).should(
      "have.text",
      "Matus"
    );
    getDynamicElementById(ID.REINBURSEMENT_ITEM_AMOUNT, 3).should(
      "have.text",
      "€10.00"
    );

    //Fifth reinbursement
    getDynamicElementById(ID.REINBURSEMENT_ITEM_PAYER, 4).should(
      "have.text",
      "Jakub"
    );
    getDynamicElementById(ID.REINBURSEMENT_ITEM_DEBTOR, 4).should(
      "have.text",
      "Matus"
    );
    getDynamicElementById(ID.REINBURSEMENT_ITEM_AMOUNT, 4).should(
      "have.text",
      "€30.00"
    );

    //Sixth reinbursement
    getDynamicElementById(ID.REINBURSEMENT_ITEM_PAYER, 5).should(
      "have.text",
      "Mrázik"
    );
    getDynamicElementById(ID.REINBURSEMENT_ITEM_DEBTOR, 5).should(
      "have.text",
      "Peto"
    );
    getDynamicElementById(ID.REINBURSEMENT_ITEM_AMOUNT, 5).should(
      "have.text",
      "€25.00"
    );

    //Seventh reinbursement
    getDynamicElementById(ID.REINBURSEMENT_ITEM_PAYER, 6).should(
      "have.text",
      "Sima"
    );
    getDynamicElementById(ID.REINBURSEMENT_ITEM_DEBTOR, 6).should(
      "have.text",
      "Peto"
    );
    getDynamicElementById(ID.REINBURSEMENT_ITEM_AMOUNT, 6).should(
      "have.text",
      "€75.00"
    );

    //Eighth reinbursement
    getDynamicElementById(ID.REINBURSEMENT_ITEM_PAYER, 7).should(
      "have.text",
      "Sima"
    );
    getDynamicElementById(ID.REINBURSEMENT_ITEM_DEBTOR, 7).should(
      "have.text",
      "Samo"
    );
    getDynamicElementById(ID.REINBURSEMENT_ITEM_AMOUNT, 7).should(
      "have.text",
      "€25.00"
    );

    //Ninth reinbursement
    getDynamicElementById(ID.REINBURSEMENT_ITEM_PAYER, 8).should(
      "have.text",
      "Tupy"
    );
    getDynamicElementById(ID.REINBURSEMENT_ITEM_DEBTOR, 8).should(
      "have.text",
      "Samo"
    );
    getDynamicElementById(ID.REINBURSEMENT_ITEM_AMOUNT, 8).should(
      "have.text",
      "€25.00"
    );
  });
});
