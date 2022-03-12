/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

import { BASE_FRONTEND } from '../../../src/api';
import { CurrentDate } from '../4-Asesor/asesor-process.spec';

// Credenciales de director
const credencialesAuth = {
  email: 'xavier@gmail.com',
  password: 'crediself-2121',
};

describe('Usuario Administrador', () => {
  it('Iniciar sesion', () => {
    cy.visit(`${BASE_FRONTEND}/login`);

    cy.loginUser(credencialesAuth.email, credencialesAuth.password);
  });

  it.skip('Section cliente', () => {
    cy.intercept('/api/notificacion?page=1').as('notificacion');
    cy.intercept('/api/sucursal?empresa=CREDISELF').as('sucursal');
    cy.intercept(
      `/api/cliente?findCliente=&page=1&idSucursal=&dateDesde=&dateHasta=${CurrentDate()}`,
    ).as('getClientes');

    cy.wait(['@notificacion', '@sucursal', '@getClientes']).then(() => {
      const acordioStadisticas = '.MuiAccordionSummary-content';
      cy.get(acordioStadisticas).click();

      const date1 = '2022-01-05';

      const inputDate1 = '#date1';
      cy.get(inputDate1).type(date1);

      const inputSearch = '#inputSearchCliente';
      cy.get(inputSearch).type('keyClient');

      const buttonSearch = '.MuiInputAdornment-root';
      cy.get(buttonSearch).click();

      cy.wait(6000);
      cy.get(acordioStadisticas).click();

      // Filter por sucursal

      const selectSucursal = '#id-sucursal-select';
      cy.get(selectSucursal).click();
      const listSelect = '#menu- > .MuiPaper-root > .MuiList-root';

      if (cy.get(listSelect).should('be.visible')) {
        cy.get(listSelect).contains('CIRCUITO').click();
        cy.wait(6000);
      }

      // Restablecer filtros clientes

      cy.get('#restablecerFilterClient').click();
      cy.wait(6000);
    });
  });

  it.skip('Option creditos', () => {
    cy.BtnMenuLateral();
    const optionNavCredit = '#option-nav-Creditos';
    cy.get(optionNavCredit).click();

    cy.intercept(
      `/api/credito?findCredito=&page=1&idSucursal=&dateDesde=&dateHasta=${CurrentDate()}`,
    ).as('getCreditos');
    cy.intercept('/api/sucursal?empresa=CREDISELF').as('sucursal');

    cy.wait(['@sucursal', '@getCreditos']).then(() => {
      cy.get('#date1').type('2022-01-05');
      cy.get('#inputSearchCreditos').type('keyCredito');

      const btnSearch = '.MuiInputAdornment-root > .MuiButtonBase-root';
      cy.get(btnSearch).click();

      cy.wait(6000);

      cy.get('#id-sucursal-select').click();
      const listSelect = '.MuiList-root';

      if (cy.get(listSelect).should('be.visible')) {
        cy.get(listSelect).contains('CIRCUITO').click();
        cy.wait(6000);
      }

      cy.get('#btnResetFilterCredit').click();
      cy.wait(6000);
    });
  });

  it('Option pago', () => {
    cy.BtnMenuLateral();
    cy.get('#option-nav-Pagos').click();

    cy.intercept(`/api/pago?findPago=&page=1&idSucursal=&dateDesde=&dateHasta=${CurrentDate()}`).as(
      'getPagos',
    );

    const acordionEstadisticas = '.MuiAccordionSummary-content';

    cy.wait('@getPagos').then(() => {
      cy.get(acordionEstadisticas).click();
      cy.get('#date1').type('2022-01-05');
      cy.get('#inputSearchPago').type('keyPago');

      const btnSearch = '.MuiInputAdornment-root > .MuiButtonBase-root';
      cy.get(btnSearch).click();

      cy.wait(6000);

      cy.get('#id-sucursal-select').click();
      const ListSelect = '#menu- > .MuiPaper-root > .MuiList-root';

      if (cy.get(ListSelect).should('be.visible')) {
        cy.get(ListSelect).contains('CIRCUITO').click();
        cy.wait(6000);
      }

      cy.get('#btnResetFIlterPago').click();
      cy.get(acordionEstadisticas).click();

      cy.wait('@getPagos').then(() => {
        // options

        const tresPuntos = ':nth-child(1) > :nth-child(10) > .MuiButtonBase-root';
        cy.get(tresPuntos).click();

        const optionPago = '#menu-list-pago';
        if (cy.get(optionPago).should('be.visible')) {
          cy.get(
            '[style="position: fixed; z-index: 1300; inset: 0px;"] > .MuiPaper-root > .MuiMenu-list > #menu-list-pago > [tabindex="0"][role="menuitem"] > a > .MuiButtonBase-root',
          ).click();
        }
      });
    });
  });

  it.skip('Cerrar sesion', () => {
    cy.CerrarSesion();
  });
});
