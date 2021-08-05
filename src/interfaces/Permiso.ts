export interface Permisos {
  idPermiso: string;
  permiso: string;
  descripcion: string;
  created_at: string | Date;
  active: number;
}

export interface PermisosByRol {
  rol: string;
  descripcion: string;
  permisos: Permisos[];
}
