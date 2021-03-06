import { api } from '.';

export const GetComisionesByUser = async (option: {
  token: string;
  dateDesde: string;
  dateHasta: string;
}) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: `/comisiones/user?dateDesde=${option.dateDesde || ''}&dateHasta=${option.dateHasta || ''}`,
  });
  return response;
};

export const GetComisionesByUserAll = async (option: {
  token: string;
  dateDesde: string;
  dateHasta: string;
  page: number;
}) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: `/comisiones/user/all?dateDesde=${option.dateDesde || ''}&dateHasta=${
      option.dateHasta || ''
    }&page=${option.page || 1}`,
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

export const GetComisionByUser = async (option: { token: string; idComisionUser: string }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: `/comisiones/user/${option.idComisionUser}`,
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

export const UpdateComisionUserStatus = async (option: {
  token: string;
  status: string;
  idsComisionUser: string[];
}) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'PUT',
    url: '/comisiones/user/status',
    data: {
      idsComisionUser: option.idsComisionUser,
      status: option.status,
    },
  });
  return response;
};
