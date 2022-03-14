/// <reference types="cypress" />

import { BASE_FRONTEND } from '../../../src/api';

// Credenciales de administrador
const credencialesAuth = {
  email: 'kevin@gmail.com',
  password: 'crediself-2121',
};

// options menu
const Detalles =
  '[style="position: fixed; z-index: 1300; inset: 0px;"] > .MuiPaper-root > .MuiMenu-list > .MuiList-root > :nth-child(2) > a > .MuiButtonBase-root';
// const Eliminar = ':nth-child(4) > a > .MuiButtonBase-root';

export const CurrentDate = (myDate?: Date) => {
  const date = myDate || new Date();
  let mes: string | number = date.getMonth() + 1;
  let dia: string | number = date.getDate();

  if (mes < 10) {
    mes = '0' + mes;
  }

  if (dia < 10) {
    dia = '0' + dia;
  }

  return date.getFullYear() + '-' + mes + '-' + dia;
};

describe('Usuario Asesor', () => {
  before(() => cy.viewport(1800, 1000));

  it('Iniciar sesion', () => {
    cy.visit(`${BASE_FRONTEND}/login`);

    cy.loginUser(credencialesAuth.email, credencialesAuth.password);
  });

  it('Section get clientes asesor', () => {
    const btnSearch = '.MuiInputAdornment-root > .MuiButtonBase-root';

    // FETCH API REST
    cy.intercept(
      `/api/cliente?findCliente=&page=1&idSucursal=&dateDesde=&dateHasta=${CurrentDate()}`,
    ).as('clientes');
    cy.intercept('/api/notificacion?page=1').as('notificacion');
    cy.intercept('/api/ciudad').as('ciudad');

    cy.wait(['@notificacion', '@clientes', '@ciudad']).then(() => {
      cy.get('#date1').type('2022-01-10');

      const inputSearch =
        '.MuiGrid-grid-md-5 > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input';
      cy.get(inputSearch).type('miCorreo@gmail.com');

      cy.get(btnSearch).click();
    });
  });

  it('New clientes asesor', () => {
    const btnNewClient = '#newClient';
    cy.get(btnNewClient).click();

    const titleModalNewClient = '.MuiCardHeader-content > .MuiTypography-root';
    cy.get(titleModalNewClient).should('have.text', 'Crear nuevo cliente');

    // Formulario new client
    const filedName =
      'form > .MuiCardContent-root > .MuiGrid-container > :nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input';

    const lastName =
      ':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input';
    const phone = ':nth-child(3) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input';
    const email = ':nth-child(4) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input';
    const dateNacimiento =
      ':nth-child(5) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input';
    const rfc = ':nth-child(6) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input';
    const genero = '#demo-simple-select-outlined';
    const addres = ':nth-child(9) > .MuiFormControl-root > .MuiInputBase-root';
    const checkEmail = '.MuiFormGroup-root > :nth-child(1) > .MuiTypography-root';

    cy.get(filedName).type('Nombre cliente');
    cy.get(lastName).type('apellido cliente');
    cy.get(phone).type('09992239138');
    cy.get(email).type('miCorreo@gmail.com');
    cy.get(dateNacimiento).type('1990-02-02');
    cy.get(rfc).type('soy el rfc');
    cy.get(genero).click();
    cy.get('.MuiList-root').contains('Masculino').click();
    cy.get(addres).type('Direccion del cliente');
    cy.get(checkEmail).click();

    cy.get('form').submit();

    cy.intercept('/api/cliente').as('newClientes');

    cy.wait('@newClientes');
  });

  it('Opcion detalle usuario', () => {
    const tresPuntosUsuario =
      ':nth-child(1) > :nth-child(10) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root';

    cy.get(tresPuntosUsuario).click();

    cy.get('.MuiMenu-list').should('be.visible');

    cy.get(Detalles).click();

    const btnNotificarCliente = '#notificarCLiente';

    if (cy.get(btnNotificarCliente).should('be.visible')) {
      cy.get(btnNotificarCliente).click();
    }

    const btnEditCliente = '.MuiGrid-justify-xs-space-around > :nth-child(3) > .MuiButtonBase-root';

    if (cy.get(btnEditCliente).should('be.visible')) {
      cy.get(btnEditCliente).click();

      const cardEdit = '.MuiCardHeader-content > .MuiTypography-root';
      cy.get(cardEdit).should('have.text', 'Editar cliente');

      const fieldName =
        '.MuiGrid-container > :nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input';
      cy.get(fieldName).type(' edit');
      cy.get('form').submit();

      cy.location().then(location => {
        const hrefDivide = location.href.split('/');

        cy.intercept(`/api/cliente/${hrefDivide[hrefDivide.length - 1]}`).as('editCliente');

        cy.wait('@editCliente');
      });
    }
  });

  it('Option credito cliente', () => {
    const btnCreditos = 'a > .MuiButtonBase-root';
    cy.get(btnCreditos).click();

    cy.location().then(location => {
      const hrefDivide = location.href.split('/');

      cy.intercept(
        `/api/credito/cliente/${hrefDivide[hrefDivide.length - 1]}?findCredito=&page=1`,
      ).as('getCretidos');

      cy.wait('@getCretidos');
    });

    const btnNewCredit = '#newCredit';
    cy.get(btnNewCredit).click();

    const headerNewCredito =
      '[style="position: fixed; z-index: 1300; inset: 0px;"] > .MuiDialog-container > .MuiDialog-paper > .MuiDialogContent-root > #alert-dialog-description > .MuiPaper-root > form > .MuiCardHeader-root > .MuiCardHeader-content > .MuiTypography-root';

    cy.get(headerNewCredito).should('have.text', 'Crear nuevo credito');

    const selectTypeCredit =
      '[style="position: fixed; z-index: 1300; inset: 0px;"] > .MuiDialog-container > .MuiDialog-paper > .MuiDialogContent-root > #alert-dialog-description > .MuiPaper-root > form > .MuiCardContent-root > .MuiGrid-container > :nth-child(1) > .MuiInputBase-root > #demo-simple-select-outlined';
    cy.get(selectTypeCredit).click();
    cy.get('.MuiList-root').contains('Bic').click();

    const inputMonto =
      '[style="position: fixed; z-index: 1300; inset: 0px;"] > .MuiDialog-container > .MuiDialog-paper > .MuiDialogContent-root > #alert-dialog-description > .MuiPaper-root > form > .MuiCardContent-root > .MuiGrid-container > :nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input';
    cy.get(inputMonto).type('25000');

    const btnSubmit =
      '[style="position: fixed; z-index: 1300; inset: 0px;"] > .MuiDialog-container > .MuiDialog-paper > .MuiDialogContent-root > #alert-dialog-description > .MuiPaper-root > form > .MuiBox-root > .MuiButtonBase-root';
    cy.get(btnSubmit).click();

    cy.intercept('/api/creditos').as('newCretido');

    cy.wait('@newCretido');
  });

  it('Option eliminar client', () => {
    cy.go('back').then(() => {
      cy.location().then(location => {
        const hrefDivide = location.href.split('/');

        cy.intercept(`/api/cliente/${hrefDivide[hrefDivide.length - 1]}`).as('getCliente');

        cy.wait('@getCliente');
      });
    });

    const btnEliminar = '#DeleteEliminar';
    cy.get(btnEliminar).click();

    const modalDeleteClient =
      '[style="position: fixed; z-index: 1300; inset: 0px;"] > .MuiDialog-container > .MuiPaper-root > #alert-dialog-title > .MuiTypography-root';
    cy.get(modalDeleteClient).should('have.text', 'Aviso importante');

    const btnAceptar = '.MuiDialogActions-root > .MuiButton-containedSecondary';
    cy.get(btnAceptar).click();
  });

  it('Cerrar sesion', () => {
    cy.CerrarSesion();
  });
});
