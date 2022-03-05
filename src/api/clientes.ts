import { api } from '.';

export interface NewClients {
  nombres: string;
  apellidos: string;
  email: string;
  sexo: string;
  telefono: number;
  direccion: string;
  ciudad: string;
  fechaNacimiento: Date | string;
  rfc: string;
  notificarSms: boolean;
  notificarEmail: boolean;
}

interface UpdateClient {
  nombres: string;
  apellidos: string;
  telefono?: number | null;
  fechaNacimiento?: string | Date | null;
  email: string;
  direccion?: string | null;
  rfc?: string | null;
  sexo: string;
  ciudad?: string | null;
  notificarEmail?: number;
  notificarSms?: number;
}

export const GetClientes = async (option: {
  token: string;
  dateDesde?: string;
  dateHasta?: string;
  idSucursal?: string;
  findCliente?: string;
  page: number;
}) => {
  const { token, idSucursal, findCliente, page, dateDesde, dateHasta } = option;

  api.defaults.headers['access-token'] = token;
  const response = await api({
    method: 'GET',
    url: `/cliente?findCliente=${findCliente || ''}&page=${page || ''}&idSucursal=${
      idSucursal || ''
    }&dateDesde=${dateDesde || ''}&dateHasta=${dateHasta || ''}`,
  });
  return response;
};

export const GetAcreditacionClientes = async (option: {
  token: string;
  findCliente?: string;
  dateDesde?: string;
  dateHasta?: string;
  page: number;
}) => {
  const { token, findCliente, dateDesde, dateHasta, page } = option;
  api.defaults.headers['access-token'] = token;
  const response = await api({
    method: 'GET',
    url: `/cliente/acreditacion?findCliente=${findCliente || ''}&page=${page}&dateDesde=${
      dateDesde || ''
    }&dateHasta=${dateHasta || ''}`,
  });
  return response;
};

export const GetCliente = async (options: { token?: string; IdCliente: string }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'GET',
    url: `/cliente/${options.IdCliente}`,
  });
  return response;
};

export const GetConfirmDataCliente = async (options: { IdCliente: string }) => {
  const response = await api({
    method: 'GET',
    url: `/cliente/confirmData/${options.IdCliente}`,
  });
  return response;
};

export const DeleteCliente = async (options: { token?: string; IdCliente: string }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'DELETE',
    url: `/cliente/${options.IdCliente}`,
  });
  return response;
};

export const NewCliente = async (options: { token: string; data: NewClients }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'POST',
    url: '/cliente',
    data: options.data,
  });
  return response;
};

export const UpdateActiveCliente = async (options: {
  token: string;
  idCliente: string;
  active: boolean;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'PUT',
    url: `/cliente/active/${options.idCliente}`,
    data: {
      active: options.active,
    },
  });
  return response;
};

export const UpdateAutorizarCliente = async (options: {
  token: string;
  idCliente: string;
  autorizar: boolean;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'PUT',
    url: `/cliente/autorizar/${options.idCliente}`,
    data: {
      autorizar: options.autorizar,
    },
  });
  return response;
};

export const UpdatecheckSupervisorCliente = async (options: {
  token: string;
  idCliente: string;
  check: boolean;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'PUT',
    url: `/cliente/checkSupervisor/${options.idCliente}`,
    data: {
      check: options.check,
    },
  });
  return response;
};

export const UpdatecheckGerenteSucCliente = async (options: {
  token: string;
  idCliente: string;
  check: boolean;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'PUT',
    url: `/cliente/checkGerenteSuc/${options.idCliente}`,
    data: {
      check: options.check,
    },
  });
  return response;
};

export const UpdatecheckDataClient = async (options: { idCliente: string; check: boolean }) => {
  const response = await api({
    method: 'PUT',
    url: `/cliente/checkDataClient/${options.idCliente}`,
    data: {
      check: options.check,
    },
  });
  return response;
};

export const NotificarDataClient = async (options: { token: string; idCliente: string }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'POST',
    url: `/cliente/notificar/data/${options.idCliente}`,
  });
  return response;
};

export const UpdateCliente = async (options: {
  token: string;
  idCliente: string;
  data: UpdateClient;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'PUT',
    url: `/cliente/${options.idCliente}`,
    data: options.data,
  });
  return response;
};
