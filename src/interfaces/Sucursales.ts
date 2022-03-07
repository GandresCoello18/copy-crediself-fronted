import { Usuario } from './Usuario';

export interface Sucursal {
  idSucursal: string;
  sucursal: string;
  direccion: string;
  telefono: number;
  created_at: string | Date;
  active: number;
  idEmpresa: string;
}

export interface SucursalByUser extends Sucursal {
  users: Usuario[];
}
