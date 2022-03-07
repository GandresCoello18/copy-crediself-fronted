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

export const GenerarPaqueteBienvenida = async (options: { token: string; idCredito: string }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'POST',
    url: `/credito/paquete-de-bienvenida/${options.idCredito}`,
  });
  return response;
};

export const AcreditarCredito = async (options: { token: string; idsCreditos: string[] }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'POST',
    url: '/credito/acreditar',
    data: {
      idsCreditos: options.idsCreditos,
    },
  });
  return response;
};

export const GenerarCompraVentaCredito = async (options: { token: string; idCredito: string }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'POST',
    url: `/credito/compra-venta/${options.idCredito}`,
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
  token: string;
  findCredito?: string;
  page: number;
  dateDesde?: string;
  dateHasta?: string;
  idSucursal?: string;
}) => {
  const { token, findCredito, page, dateDesde, dateHasta, idSucursal } = option;
  api.defaults.headers['access-token'] = token;
  const response = await api({
    method: 'GET',
    url: `/credito?findCredito=${findCredito || ''}&page=${page}&idSucursal=${
      idSucursal || ''
    }&dateDesde=${dateDesde || ''}&dateHasta=${dateHasta || ''}`,
  });
  return response;
};

export const GetCreditosByUser = async (option: {
  token: string;
  findCredito?: string;
  page: number;
  dateDesde?: string;
  dateHasta?: string;
  idUser: string;
}) => {
  const { token, findCredito, page, dateDesde, dateHasta, idUser } = option;
  api.defaults.headers['access-token'] = token;
  const response = await api({
    method: 'GET',
    url: `/credito/user/${idUser}/?findCredito=${findCredito || ''}&page=${page}&dateDesde=${
      dateDesde || ''
    }&dateHasta=${dateHasta || ''}`,
  });
  return response;
};

export const GetCreditosCliente = async (option: {
  token: string;
  findCredito?: string;
  idCliente: string;
  page: number;
}) => {
  const { token, findCredito, idCliente, page } = option;
  api.defaults.headers['access-token'] = token;
  const response = await api({
    method: 'GET',
    url: `/credito/cliente/${idCliente}?findCredito=${findCredito || ''}&page=${page}`,
  });
  return response;
};

export const GetCreditosUser = async (option: {
  token: string;
  findCredito?: string;
  idUser: string;
  page: number;
}) => {
  const { token, findCredito, idUser, page } = option;
  api.defaults.headers['access-token'] = token;
  const response = await api({
    method: 'GET',
    url: `/credito/user/${idUser}?findCredito=${findCredito || ''}&page=${page}`,
  });
  return response;
};

export const GetCredito = async (options: { token: string; IdCredito: string }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'GET',
    url: `/credito/${options.IdCredito}`,
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

export const UpdateContratoByCredito = async (options: {
  token: string;
  data: FormData;
  idCreditoContrato: string;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'PUT',
    url: `/credito/contrato/${options.idCreditoContrato}`,
    data: options.data,
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
  idNotification?: string;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'PUT',
    url: `/credito/autorizar/${options.IdCredito}`,
    data: {
      autorizar: options.autorizar,
      idNotification: options.idNotification,
    },
  });
  return response;
};
