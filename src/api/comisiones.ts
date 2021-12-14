import { api } from '.';

export const GetComisionesByUser = async (option: { token: string; mes?: string }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: `/comisiones/user?mes=${option.mes || ''}`,
  });
  return response;
};

export const GetComisiones = async (option: { token: string }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: '/comisiones',
  });
  return response;
};

export const UpdateComision = async (option: {
  token: string;
  idComision: string;
  porcentaje: number;
}) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'PUT',
    url: `/comisiones/${option.idComision}`,
    data: {
      porcentaje: option.porcentaje,
    },
  });
  return response;
};
