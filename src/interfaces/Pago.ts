import { Cliente } from './Cliente';
import { Credito } from './Credito';

export interface Pago {
  idPago: string;
  idCredito: string;
  pagado_el: string;
  created_at: string;
  mes_correspondiente: string;
  tipo_de_pago: string;
  active: number;
  atrasado: number;
  numeroPago: number;
  valor: number;
  estado: 'Completado' | 'Abonado';
  aprobado: number;
  source: string | null;
}

export interface PagoByCredito extends Pago {
  credito: Credito;
  cliente: Cliente;
}
