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
}

export const GetClientes = async (option: {
  token?: string;
  findCliente?: string;
  page: number;
}) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: `${
      option.findCliente
        ? `/cliente?findCliente=${option.findCliente}&page=${option.page}`
        : `/cliente?page=${option.page}`
    }`,
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
