// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('loginUser', (email, password) => {
  const inputEmail =
    ':nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input';

  cy.get(inputEmail).type(email);

  const inputPassword =
    ':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input';

  cy.get(inputPassword).type(password);

  const buttonEntrar = '#enterLogin';
  cy.get(buttonEntrar).click();
});

Cypress.Commands.add('BtnMenuLateral', () => {
  const menuLateral = '#menuLateral';
  if (cy.get(menuLateral).should('be.visible')) {
    cy.get(menuLateral).click({ force: true });
  }
});

Cypress.Commands.add('CerrarSesion', () => {
  cy.BtnMenuLateral();

  const OptionCerrarSesion = '#optionCloseSesion';
  cy.get(OptionCerrarSesion).click();
});
