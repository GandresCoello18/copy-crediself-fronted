export const RenderMainViewRol = (Rol: string) => {
  switch (Rol) {
    case 'Director':
      return '/app/permisos';
    default:
      return '/app/dashboard';
  }
};
