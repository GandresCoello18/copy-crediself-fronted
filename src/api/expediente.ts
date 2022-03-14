import { api } from '.';

export const AddFileExpediente = async (options: { token: string; data: FormData }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'POST',
    url: '/expediente',
    data: options.data,
  });
  return response;
};

export const AddFileExpedienteDoc = async (options: { token: string; data: FormData }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'POST',
    url: '/expediente/pdf',
    data: options.data,
  });
  return response;
};

export const GetExpedienteRequisitos = async (options: { token: string }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'GET',
    url: '/expediente/requisitos',
  });
  return response;
};

export const RemoveFileExpediente = async (options: {
  token: string;
  idExpedienteClient: string;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'DELETE',
    url: `/expediente/${options.idExpedienteClient}`,
  });
  return response;
};
