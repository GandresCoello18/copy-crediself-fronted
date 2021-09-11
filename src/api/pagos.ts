import { api } from '.';
import { ParamsFilterPagos } from '../view/pagos-credito';

export const AddPagoCredito = async (options: { token: string; data: FormData }) => {
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
  const { isAtrasado, datePayment, dateRegister, typePayment, dateCorrespondiente } = ParamsFilter;

  api.defaults.headers['access-token'] = token;
  const response = await api({
    method: 'GET',
    url: `/pago/credito/${idCredito}?findPago=${typePayment || ''}&page=${page}&isAtrasado=${
      isAtrasado || 0
    }&datePayment=${datePayment || ''}&dateRegister=${dateRegister || ''}&dateCorrespondiente=${
      dateCorrespondiente || ''
    }`,
  });
  return response;
};

export const UpdateAprobarPayment = async (options: {
  token: string;
  idPago: string;
  aprobar: number;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'PUT',
    url: `/pago/aprobado/${options.idPago}`,
    data: {
      aprobar: options.aprobar,
    },
  });
  return response;
};

export const UpdateComprobantePayment = async (options: {
  token: string;
  idPago: string;
  data: FormData;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'PUT',
    url: `/pago/comprobante/${options.idPago}`,
    data: options.data,
  });
  return response;
};
