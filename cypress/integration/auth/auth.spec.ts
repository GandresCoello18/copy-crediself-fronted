/* eslint-disable @typescript-eslint/no-use-before-define */
/// <reference types="cypress" />

import { BASE_FRONTEND } from '../../../src/api';

// Credenciales de administrador
const credencialesAuth = {
  email: 'xavier@gmail.com',
  password: 'crediself-2121',
};

describe('Visit login', () => {
  it('Iniciar sesion', () => {
    cy.visit(`${BASE_FRONTEND}/login`);

    const inputEmail =
      ':nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input';

    cy.get(inputEmail).type(credencialesAuth.email);

    const inputPassword =
      ':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input';

    cy.get(inputPassword).type(credencialesAuth.password);

    const buttonEntrar = '.jss21 > .MuiButtonBase-root';
    cy.get(buttonEntrar).click();

    // FETCH API REST

    cy.intercept('/api/pago?findPago=&page=1&idSucursal=&dateDesde=&dateHasta=2022-03-10').as(
      'pago',
    );
    cy.intercept('/api/notificacion?page=1').as('notificacion');
    cy.intercept('/api/sucursal?empresa=CREDISELF').as('sucursal');

    cy.wait(['@notificacion', '@pago', '@sucursal']).then(() => {
      const menuLateral = '.MuiToolbar-root > :nth-child(4)';

      cy.get(menuLateral).click();

      const OptionCerrarSesion = '.jss78 > .MuiButtonBase-root';

      cy.get(OptionCerrarSesion).click();
    });

    /* Recuperar cuenta */

    const linkForgetPassword = 'a > .MuiTypography-root';

    cy.get(linkForgetPassword).click();

    const inputEmailAcount = '.MuiInputBase-input';

    cy.get(inputEmailAcount).type(credencialesAuth.email);
    cy.get('form').submit();
    cy.intercept('/api/timeMessage').as('timeMensaje');
    cy.wait('@timeMensaje');

    cy.get('.jss26').should('have.text', 'Revisa tu correo y sigue las instrucciones');
  });
});
