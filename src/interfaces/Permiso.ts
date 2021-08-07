export interface Permisos {
  idPermiso: string;
  permiso: string;
  descripcion: string;
  created_at: string | Date;
  active: number;
}

export interface PermisosResponseByRol extends Permisos {
  activePBR: string;
  idPermisoRol: string;
}

export interface PermisosByRol {
  rol: string;
  descripcion: string;
  permisos: PermisosResponseByRol[];
}
