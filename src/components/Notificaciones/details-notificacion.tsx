/* eslint-disable @typescript-eslint/no-use-before-define */
import { Card } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { NotificacionByMe } from '../../interfaces/Notificacion';

interface Props {
  notifiacion: NotificacionByMe | undefined;
}

export const DetailsNotificacion = ({ notifiacion }: Props) => {
  return (
    <Card>
      {notifiacion ? (
        'si existe'
      ) : (
        <>
          <img
            src='../empty.png'
            alt='no data notificacion'
            title='no data notificacion'
            width='100%'
            style={{ padding: 10 }}
          />
          <Alert severity='info'>
            Selecciona alguna <strong>notificación</strong> para más detalles.
          </Alert>
        </>
      )}
    </Card>
  );
};
