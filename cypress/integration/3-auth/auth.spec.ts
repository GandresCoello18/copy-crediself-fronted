/* eslint-disable @typescript-eslint/no-use-before-define */
/// <reference types="cypress" />

import { BASE_FRONTEND } from '../../../src/api';
import { CurrentDate } from '../4-Asesor/asesor-process.spec';

// Credenciales de administrador
const credencialesAuth = {
  email: 'xavier@gmail.com',
  password: 'crediself-2121',
};

describe('Visit login', () => {
  it('Iniciar sesion', () => {
    cy.visit(`${BASE_FRONTEND}/login`);

    cy.loginUser(credencialesAuth.email, credencialesAuth.password);

    // FETCH API REST

    cy.intercept(`/api/pago?findPago=&page=1&idSucursal=&dateDesde=&dateHasta=${CurrentDate()}`).as(
      'pago',
    );
    cy.intercept('/api/notificacion?page=1').as('notificacion');
    cy.intercept('/api/sucursal?empresa=CREDISELF').as('sucursal');

    cy.wait(['@notificacion', '@pago', '@sucursal']).then(() => {
      cy.CerrarSesion();
    });

    /* Recuperar cuenta */

    const linkForgetPassword = 'a > .MuiTypography-root';

    cy.get(linkForgetPassword).click();

    const inputEmailAcount = '.MuiInputBase-input';

    cy.get(inputEmailAcount).type(credencialesAuth.email);
    cy.get('form').submit();
    cy.intercept('/api/timeMessage').as('timeMensaje');
    cy.wait('@timeMensaje');

    cy.get('.makeStyles-title-31').should(
      'have.text',
      'Revisa tu correo y sigue las instrucciones',
    );
  });
});
