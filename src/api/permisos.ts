import { api } from '.';

export const GetPermisosByRole = async (option: { token?: string }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: '/permiso',
  });
  return response;
};
