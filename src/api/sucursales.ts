import { api } from '.';
import { EmpresaUser } from '../context/contextMe';

export const GetSucursales = async (option: { token: string; empresa?: EmpresaUser }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: `/sucursal?empresa=${option.empresa || ''}`,
  });
  return response;
};

export const GetSucursalesByUser = async (option: { token: string; empresa?: EmpresaUser }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: `/sucursal/user/all/?empresa=${option.empresa || ''}`,
  });
  return response;
};
