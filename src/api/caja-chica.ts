import { api } from '.';

interface InputCaja {
  concepto: string;
  gasto: number;
  observaciones?: string;
}

export const AddExpenses = async (option: { token?: string; data: InputCaja }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'POST',
    url: '/caja-chica',
  });
  return response;
};

export const GetExpenses = async (option: {
  token?: string;
  findGasto?: string;
  findDate?: string;
  isStatistics?: string;
  idSucursal?: string;
  page: number;
}) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: `/caja-chica?findGasto=${option.findGasto || ''}&findDate=${
      option.findDate || ''
    }&idSucursal=${option.idSucursal || ''}&isStatistics=${option.isStatistics || ''}&page=${
      option.page
    }`,
  });
  return response;
};

export const DeleteExpenses = async (options: { token?: string; IdGasto: string }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'DELETE',
    url: `/caja-chica/${options.IdGasto}`,
  });
  return response;
};
