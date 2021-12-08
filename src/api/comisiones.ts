import { api } from '.';

export const GetComisionesByUser = async (option: { token: string; mes?: string }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: `/comisiones/user?mes=${option.mes || ''}`,
  });
  return response;
};
