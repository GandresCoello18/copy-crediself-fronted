/* eslint-disable @typescript-eslint/no-use-before-define */
import { Card } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { AxiosError } from 'axios';
import React, { useContext, useEffect } from 'react';
import { toast } from 'react-toast';
import { MeContext } from '../../context/contextMe';
import { HandleError } from '../../helpers/handleError';
import { UpdateReadNotificacion } from '../../api/notificacion';
import { NotificacionByMe } from '../../interfaces/Notificacion';
import { SolicitudCredito } from './template/solicitud-de-credito';
import { TemplateAutorizacionCliente } from './template/autorizacion-cliente';

interface Props {
  notifiacion: NotificacionByMe | undefined;
}

export const DetailsNotificacion = ({ notifiacion }: Props) => {
  const { token } = useContext(MeContext);

  useEffect(() => {
    const fetchIsRead = async () => {
      try {
        await UpdateReadNotificacion({ token, idNotification: notifiacion?.idNotification || '' });
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
      }
    };

    notifiacion?.isRead === 0 && fetchIsRead();
  }, [notifiacion, token]);

  const renderTemplate = (notifiacion: NotificacionByMe) => {
    if (notifiacion.title === 'Solicitud para la autorización de credito') {
      return <SolicitudCredito notifiacion={notifiacion} />;
    }

    if (notifiacion.title === 'Solicitud para la autorización de cliente') {
      return <TemplateAutorizacionCliente notificacion={notifiacion} />;
    }

    if (notifiacion.title.includes('te invita ha revisar la documentación de un cliente')) {
      return <TemplateAutorizacionCliente notificacion={notifiacion} />;
    }

    return <p>No hay plantilla programada</p>;
  };

  return (
    <Card style={{ padding: 10 }}>
      {notifiacion ? (
        renderTemplate(notifiacion)
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
