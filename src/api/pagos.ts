import { api } from '.';

interface InputAddPago {
  idCredito: string;
  pagadoEl: string;
  tipoDePago: string;
}

export const AddPagoCredito = async (options: { token: string; data: InputAddPago }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'POST',
    url: '/pago',
    data: options.data,
  });
  return response;
};

export const GetPagosCreditos = async (options: {
  token: string;
  findPago?: string;
  page: number;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'GET',
    url: `/pago?findPago=${options.findPago || ''}&page=${options.page}`,
  });
  return response;
};

export const GetPagosByCredito = async (options: {
  token: string;
  findPago?: string;
  idCredito: string;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'GET',
    url: `/pago/credito/${options.idCredito}?findPago=${options.findPago || ''}`,
  });
  return response;
};
