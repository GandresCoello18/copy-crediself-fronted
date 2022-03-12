/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    loginUser(email: string, password: string);
    CerrarSesion();
    BtnMenuLateral();
  }
}
