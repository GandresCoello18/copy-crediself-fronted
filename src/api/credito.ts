import { api } from '.';

interface InputContrato {
  tipo: string;
  monto: string;
  idCliente: string;
}

export const NewContrato = async (options: { token: string; data: InputContrato }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'POST',
    url: '/credito',
    data: options.data,
  });
  return response;
};

export const NotificarAutorizarCredito = async (options: { token: string; IdCredito: string }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'POST',
    url: '/credito/autorizar',
    data: {
      idCredito: options.IdCredito,
    },
  });
  return response;
};

export const GetCreditos = async (option: {
  token?: string;
  findCredito?: string;
  page: number;
}) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: `${
      option.findCredito
        ? `/credito?findCredito=${option.findCredito}&page=${option.page}`
        : `/credito?page=${option.page}`
    }`,
  });
  return response;
};

export const UpdateActiveCredito = async (options: {
  token: string;
  active: boolean;
  IdCredito: string;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'PUT',
    url: `/credito/active/${options.IdCredito}`,
    data: {
      active: options.active,
    },
  });
  return response;
};

export const UpdateStatusCredito = async (options: {
  token: string;
  status: string;
  IdCredito: string;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'PUT',
    url: `/credito/status/${options.IdCredito}`,
    data: {
      status: options.status,
    },
  });
  return response;
};

export const UpdateAutorizarCredito = async (options: {
  token: string;
  autorizar: boolean;
  IdCredito: string;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'PUT',
    url: `/credito/autorizar/${options.IdCredito}`,
    data: {
      autorizar: options.autorizar,
    },
  });
  return response;
};
