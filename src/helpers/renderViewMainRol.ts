import PermisosByRolJson from './permisosByRol.json';

export const RenderMainViewRol = (Rol: string) => {
  switch (Rol) {
    case 'Director':
      return '/app/roles';
    case 'Gerente Regional':
      return '/app/usuarios';
    case 'RRHH':
      return '/app/usuarios';
    case 'Gerente de Sucursal':
      return '/app/clientes';
    case 'Administrativo':
      return '/app/clientes';
    case 'Supervisor':
      return '/app/clientes';
    case 'Asesor':
      return '/app/clientes';
    case 'Referencia':
      return '/app/mis-comisiones';
    case 'Cobranza':
      return '/app/cancelaciones';
    default:
      return '/app/dashboard';
  }
};

export const getPermisoExist = (options: { RolName: string; permiso: string }) => {
  const findRol = PermisosByRolJson.find(ByRol => ByRol.rol === options.RolName);

  if (!findRol) {
    return false;
  }

  const finPermiso = findRol.permisos.find(per => per === options.permiso);

  if (!finPermiso) {
    return false;
  }

  return true;
};
