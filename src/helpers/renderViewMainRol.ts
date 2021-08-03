export const RenderMainViewRol = (Rol: string) => {
  switch (Rol) {
    case 'Director':
      return '/app/roles';
    default:
      return '/app/dashboard';
  }
};
