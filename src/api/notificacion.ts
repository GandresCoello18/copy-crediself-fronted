import { api } from '.';

export const GetNotificacion = async (option: { token?: string; page: number }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: option.page ? `/notificacion?page=${option.page}` : '/notificacion',
  });
  return response;
};

export const UpdateReadNotificacion = async (option: {
  token?: string;
  idNotification: string;
}) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'PUT',
    url: `/notificacion/${option.idNotification}`,
  });
  return response;
};

export const UpdateAllReadNotificacion = async (option: { token?: string }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'PUT',
    url: '/notificacion/all',
  });
  return response;
};
