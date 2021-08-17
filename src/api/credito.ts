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
