import { Cliente } from './Cliente';

export interface Credito {
  idCredito: string;
  tipo: string;
  monto: string;
  created_at: string | Date;
  idCliente: string;
  apertura: number;
  referencia: string;
  autorizado: number;
  active: number;
  numeroCredito: number;
  estado: 'Pendiente' | 'Al dia' | 'Completado' | 'Atrasado';
  inscripcion: number;
  iva: number;
  cuota: number;
  total: number;
  idSucursal: string;
  progress?: number;
}

export interface CreditoByContrato {
  id_credito_contrato: string;
  tipoContrato: string;
  contrato: string;
  active: number;
  idContrato: string;
  source: string;
  updated_at: string | Date;
  isPackageWelcome: number;
}

export interface CreditoByCliente extends Credito {
  contratos: CreditoByContrato[];
  cliente: Cliente;
}
