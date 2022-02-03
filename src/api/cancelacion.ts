import { api } from '.';

export const NewCancelacion = async (option: { token: string; idCredito: string }) => {
  const { token, idCredito } = option;
  api.defaults.headers['access-token'] = token;
  const response = await api({
    method: 'POST',
    url: '/cancelacion',
    data: {
      idCredito,
    },
  });
  return response;
};

export const GetCancelaciones = async (option: {
  token: string;
  dateInit?: string;
  dateEnd?: string;
  find?: string;
  page: number;
}) => {
  const { token, dateEnd, dateInit, find, page } = option;
  api.defaults.headers['access-token'] = token;
  const response = await api({
    method: 'GET',
    url: `/cancelacion?page=${page || ''}&dateInit=${
      dateInit === 'dd/mm/aaaa' ? '' : dateInit
    }&dateEnd=${dateEnd === 'dd/mm/aaaa' ? '' : dateEnd}&find=${find}`,
  });
  return response;
};

export const GetCancelacion = async (option: { token: string; idCancelacion: string }) => {
  const { token, idCancelacion } = option;
  api.defaults.headers['access-token'] = token;
  const response = await api({
    method: 'GET',
    url: `/cancelacion/${idCancelacion}`,
  });
  return response;
};

export const UpdateAcuerdoCancelacion = async (option: {
  token: string;
  idCancelacion: string;
  acuerdo: string;
}) => {
  const { token, idCancelacion, acuerdo } = option;
  api.defaults.headers['access-token'] = token;
  const response = await api({
    method: 'PUT',
    url: `/cancelacion/acuerdo/${idCancelacion}`,
    data: {
      acuerdo,
    },
  });
  return response;
};

export const UpdateAutorizacionCancelacion = async (option: {
  token: string;
  idCancelacion: string;
  autorizacion: boolean;
}) => {
  const { token, idCancelacion, autorizacion } = option;
  api.defaults.headers['access-token'] = token;
  const response = await api({
    method: 'PUT',
    url: `/cancelacion/autorizado/${idCancelacion}`,
    data: {
      autorizacion,
    },
  });
  return response;
};

export const DeleteCancelacion = async (option: { token: string; idCancelacion: string }) => {
  const { token, idCancelacion } = option;
  api.defaults.headers['access-token'] = token;
  const response = await api({
    method: 'DELETE',
    url: `/cancelacion/${idCancelacion}`,
  });
  return response;
};
