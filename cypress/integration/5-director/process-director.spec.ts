/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

import { BASE_FRONTEND } from '../../../src/api';

// Credenciales de director
const credencialesAuth = {
  email: 'goyeselcoca@gmail.com',
  password: 'crediself-2121',
};

describe('Usuario Director', () => {
  before(() => cy.viewport(1800, 1000));

  it('Iniciar sesion', () => {
    cy.visit(`${BASE_FRONTEND}/login`);

    cy.loginUser(credencialesAuth.email, credencialesAuth.password);
  });

  it('Section rols', () => {
    cy.intercept('/api/notificacion?page=1').as('notificacion');
    cy.intercept('/api/rol').as('roles');

    cy.wait(['@notificacion', '@roles']).then(() => {
      cy.BtnMenuLateral();

      const btnOptionAddUser = '#option-nav-Usuarios';
      cy.get(btnOptionAddUser).click();
    });
  });

  it('Section add user', () => {
    const btnNewUserRRH = '.MuiBox-root-118 > .MuiButtonBase-root';
    cy.get(btnNewUserRRH).click();

    const headModalAddUser =
      '[style="position: fixed; z-index: 1300; inset: 0px;"] > .MuiDialog-container > .MuiDialog-paper > .MuiDialogContent-root > #alert-dialog-description > .MuiPaper-root > form > .MuiCardHeader-root > .MuiCardHeader-content > .MuiTypography-root';
    cy.get(headModalAddUser).should('have.text', 'Crear nuevo usuario RRHH');

    // formulario

    const nombres = '#newUserNombre';
    const apellidos = '#newUserApellido';
    const username = '#newUserUsername';
    const email = '#newUserEmail';
    const password = '#newUserPassword';
    const razonSocial = '#newUserRazonSocial';
    const nacimiento = '#newUserNacimiento';
    const sexo = '#newUserSexo';
    const sucursales = '#newUserSucursal';
    const list = '.MuiPaper-root > .MuiList-root';

    cy.get(nombres).type('Nombre usuario');
    cy.get(apellidos).type('Apellidos usuario');
    cy.get(username).type('Nombre de usuario app');
    cy.get(email).type('nombre@gamil.com');
    cy.get(password).type(credencialesAuth.password);
    cy.get(razonSocial).type('GGHRHE556ED');
    cy.get(nacimiento).type('2000-05-05');
    cy.get(sexo).click();

    if (cy.get(list).should('be.visible')) {
      cy.get(list).contains('Masculino').click();
    }

    cy.get(sucursales).click();

    if (cy.get(list).should('be.visible')) {
      cy.get(list).contains('VERACRUZ').click();
    }

    const btnRegister = '#formNewUser';
    cy.get(btnRegister).submit();

    cy.wait(7000);

    const btnDelete = ':nth-child(1) > :nth-child(10) > .MuiButtonBase-root';
    cy.get(btnDelete).click();

    const modalDeleteClient =
      '[style="position: fixed; z-index: 1300; inset: 0px;"] > .MuiDialog-container > .MuiPaper-root > #alert-dialog-title > .MuiTypography-root';
    cy.get(modalDeleteClient).should('have.text', 'Aviso importante');

    const btnAceptar = '.MuiDialogActions-root > .MuiButton-containedSecondary';
    cy.get(btnAceptar).click();
  });

  it('Cerrar sesion', () => {
    cy.wait(5000);
    cy.CerrarSesion();
  });
});
