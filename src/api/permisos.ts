import { api } from '.';

export const GetPermisosByRoles = async (option: { token?: string }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: '/',
  });
  return response;
};
