/* eslint-disable @typescript-eslint/no-use-before-define */
import { Button, Card } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { AxiosError } from 'axios';
import React, { useContext, useEffect } from 'react';
import { toast } from 'react-toast';
import { MeContext } from '../../context/contextMe';
import { HandleError } from '../../helpers/handleError';
import { UpdateReadNotificacion } from '../../api/notificacion';
import { NotificacionByMe } from '../../interfaces/Notificacion';
import { SolicitudCredito } from './template/solicitud-de-credito';
import { TemplateDefault } from './template/autorizacion-cliente';

interface Props {
  notifiacion: NotificacionByMe | undefined;
}

export const DetailsNotificacion = ({ notifiacion }: Props) => {
  const { token } = useContext(MeContext);

  useEffect(() => {
    const fetchIsRead = async () => {
      try {
        await UpdateReadNotificacion({ token, idNotification: notifiacion?.idNotification || '' });

        if (notifiacion) {
          notifiacion.isRead = 1;
        }
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
      return (
        <TemplateDefault notificacion={notifiacion}>
          <a href={`${notifiacion.link}`} target='_blank' rel='noreferrer'>
            <Button variant='contained' color='primary'>
              Ver Cliente
            </Button>
          </a>
        </TemplateDefault>
      );
    }

    if (notifiacion.title.includes('te invita ha revisar la documentación de un cliente')) {
      return (
        <TemplateDefault notificacion={notifiacion}>
          <a href={`${notifiacion.link}`} target='_blank' rel='noreferrer'>
            <Button variant='contained' color='primary'>
              Ver Cliente
            </Button>
          </a>
        </TemplateDefault>
      );
    }

    if (notifiacion.title === 'Respuesta de solicitud de cancelación') {
      return (
        <TemplateDefault notificacion={notifiacion}>
          <a href={`${notifiacion.link}`} target='_blank' rel='noreferrer'>
            <Button variant='contained' color='primary'>
              Ver Cancelación
            </Button>
          </a>
        </TemplateDefault>
      );
    }

    if (notifiacion.title.includes('presenta reclamo en pago de comisiones')) {
      return (
        <TemplateDefault notificacion={notifiacion}>
          <a href={`${notifiacion.link}`} target='_blank' rel='noreferrer'>
            <Button variant='contained' color='primary'>
              Ver comision
            </Button>
          </a>
        </TemplateDefault>
      );
    }

    if (notifiacion.title.includes('revisar una solicitud de cancelación')) {
      return (
        <TemplateDefault notificacion={notifiacion}>
          <a href={`${notifiacion.link}`} target='_blank' rel='noreferrer'>
            <Button variant='contained' color='primary'>
              Ver Cancelación
            </Button>
          </a>
        </TemplateDefault>
      );
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
