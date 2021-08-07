import { api } from '.';

export const GetPermisosByRole = async (option: { token?: string }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: '/permiso',
  });
  return response;
};

export const UpdateActivePermisoByRol = async (option: {
  token?: string;
  active: boolean;
  idPermisoRol: string;
}) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'PUT',
    data: {
      active: option.active,
    },
    url: `/permiso/active/${option.idPermisoRol}`,
  });
  return response;
};
