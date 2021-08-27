import { api } from '.';

export const GetSucursales = async (option: { token?: string }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: '/sucursal',
  });
  return response;
};
