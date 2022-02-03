import { Usuario } from './Usuario';

export interface Notificacion {
  idNotification: string;
  sendingUser?: string;
  receiptUser: string;
  created_at: string | Date;
  title:
    | 'Solicitud para la autorización de credito'
    | 'Solicitud para la autorización de cliente'
    | 'te invita ha revisar la documentación de un cliente'
    | 'Respuesta de solicitud de cancelación';
  body: string;
  link: string;
  isRead: number;
}

export interface NotificacionByMe extends Notificacion {
  sendDataUser: Usuario;
}
