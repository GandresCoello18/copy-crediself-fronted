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

export const AperturaPagoCredito = async (options: { token: string; data: FormData }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'POST',
    url: '/pago/credito/apertura',
    data: options.data,
  });
  return response;
};

export const GetPagosCreditos = async (options: {
  token: string;
  findPago?: string;
  idSucursal?: string;
  dateDesde?: string;
  dateHasta?: string;
  page: number;
}) => {
  const { idSucursal, token, findPago, dateHasta, dateDesde, page } = options;
  api.defaults.headers['access-token'] = token;
  const response = await api({
    method: 'GET',
    url: `/pago?findPago=${findPago || ''}&page=${page}&idSucursal=${idSucursal || ''}&dateDesde=${
      dateDesde || ''
    }&dateHasta=${dateHasta || ''}`,
  });
  return response;
};

export const GetReciboPagosByCredito = async (options: {
  token: string;
  page?: number;
  idCredito: string;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'GET',
    url: `/pago/recibo/${options.idCredito}?page=${options.page || ''}`,
  });
  return response;
};

export const GetReciboPago = async (options: { token: string; idPago: string }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'GET',
    url: `/pago/descargar-recibo-pago/${options.idPago}`,
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

export const RemoveComprobantePayment = async (options: { token: string; idPago: string }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'DELETE',
    url: `/pago/comprobante/${options.idPago}`,
  });
  return response;
};
