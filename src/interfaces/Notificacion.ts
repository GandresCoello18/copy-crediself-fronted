import { Usuario } from './Usuario';

export interface Notificacion {
  idNotification: string;
  sendingUser?: string;
  receiptUser: string;
  created_at: string | Date;
  title: 'Solicitud para la autorización de credito';
  body: string;
  link: string;
  isRead: number;
}

export interface NotificacionByMe extends Notificacion {
  sendDataUser: Usuario;
}
