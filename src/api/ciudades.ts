import { api } from '.';

export const GetCiudades = async (option: { token?: string }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: '/ciudad',
  });
  return response;
};
