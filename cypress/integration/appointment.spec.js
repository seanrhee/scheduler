describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");

    cy.visit("/");

    cy.contains("li", "Monday");
  });

  it("should book an interview", () => {
    cy.get("[alt=Add]")
      .first()
      .click()
    cy.get("[data-testid=student-name-input]")
      .type("Lydia Miller-Jones")

    cy.get("[alt='Sylvia Palmer']")
      .click()
    cy.contains("Save")
      .click();
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it("should edit an interview", () => {
    cy.get("[alt=Edit]")
      .first()
      .click({ force: true })
    cy.get("[data-testid=student-name-input]")
      .clear()
      .type("Lydia Miller-Jones");
    cy.get("[alt='Susan Reynolds']")
      .click();
    cy.contains("Save")
      .click();
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Susan Reynolds");
  });

  it("should cancel an interview", () => {
    cy.get("[alt=Delete]")
      .click({ force: true })
    cy.contains("Confirm")
      .click()
    cy.contains("DELETING")
      .should("exist")
    cy.contains("DELETING")
      .should("not.exist");
    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");
  });
});