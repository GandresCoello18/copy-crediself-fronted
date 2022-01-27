import { Cliente } from './Cliente';
import { Credito, CreditoByContrato } from './Credito';
import { Usuario } from './Usuario';

export interface Cancelacion {
  idCancelacion: string;
  idCredito: string;
  created_at: string | Date;
  idUser: string;
}

export interface CancelacionByDetails extends Cancelacion {
  credito: Credito;
  user: Usuario;
  cliente: Cliente;
  contratos: CreditoByContrato[];
}
