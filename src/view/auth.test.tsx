/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { mount } from '@cypress/react';
import { Auth } from './auth';

it('renders learn react', () => {
  mount(<Auth />);
});

it('renders app and fetch elemnet using react-selector', () => {
  mount(<Auth />);

  cy.waitForReact();
  cy.react('Auth').should('be.visible');
});
