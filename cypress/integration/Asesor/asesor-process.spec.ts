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
// const Solicitar = ':nth-child(3) > a > .MuiButtonBase-root';
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

    const inputEmail =
      ':nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input';

    cy.get(inputEmail).type(credencialesAuth.email);

    const inputPassword =
      ':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input';

    cy.get(inputPassword).type(credencialesAuth.password);

    const buttonEntrar = '.jss21 > .MuiButtonBase-root';
    cy.get(buttonEntrar).click();
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

      /*cy.intercept(
        `/api/cliente?findCliente=miCorreo@gmail.comc&page=1&idSucursal=&dateDesde=2022-01-10&dateHasta=${CurrentDate()}`,
      ).as('filterClientes');

      cy.wait('@filterClientes');*/
    });
  });

  it('New clientes asesor', () => {
    const btnNewClient = '.jss90 > .MuiButtonBase-root';
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

    const btnNotificarCliente = '.MuiGrid-justify-xs-space-around > :nth-child(2) > [tabindex="0"]';

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

    cy.go('back');
  });

  it('Cerrar sesion', () => {
    const menuLateral = '.MuiToolbar-root > :nth-child(4)';

    cy.get(menuLateral).click();

    const OptionCerrarSesion = '.jss78 > .MuiButtonBase-root';

    cy.get(OptionCerrarSesion).click();
  });
});
