import { Usuario } from './Usuario';

export type StatusComision = 'Pendiente' | 'Pagado' | 'Cancelado';

export interface Comision {
  idComision: string;
  created_at: string | Date;
  comisionType: string | null;
  porcentaje: number;
  idRol: string;
  descripcion: string | null;
}

export interface ComisionesUsuarios {
  idComisionUser: string;
  idComision: string;
  created_at: string | Date;
  mesComision?: string | Date;
  idUser: string;
  total: number;
  fechaHaPagar: string | Date;
  status: StatusComision;
}

export interface MisComisiones extends Comision, ComisionesUsuarios {
  user: Usuario;
}

// ESTADISTICAS DE COMISIONES

interface Clientes {
  count: number;
  countMonth: number;
  countLastMonth: number;
}

type Ventas = Clientes;

interface Task {
  progress: number;
}

interface Grafico {
  labels: string[];
  data: number[];
  data2: number[];
}

export interface StaticComision {
  clientes: Clientes;
  ventas: Ventas;
  task: Task;
  grafico: Grafico;
  Amount: number;
}
