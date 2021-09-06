import { api } from '.';
import { ParamsFilterPagos } from '../view/pagos-credito';

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
  page: number;
  idCredito: string;
  ParamsFilter: ParamsFilterPagos;
}) => {
  const { token, page, idCredito, ParamsFilter } = options;
  const { isAtrasado, datePayment, dateRegister, typePayment } = ParamsFilter;

  api.defaults.headers['access-token'] = token;
  const response = await api({
    method: 'GET',
    url: `/pago/credito/${idCredito}?findPago=${typePayment || ''}&page=${page}&isAtrasado=${
      isAtrasado || 0
    }&datePayment=${datePayment || ''}&dateRegister=${dateRegister || ''}`,
  });
  return response;
};
