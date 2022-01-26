import { api } from '.';

export interface NewNoti {
  sendingUser?: string;
  receiptUser: string;
  title: string;
  body: string;
  link: string | null;
}

export const GetNotificacion = async (option: { token?: string; page: number }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: option.page ? `/notificacion?page=${option.page}` : '/notificacion',
  });
  return response;
};

export const NewNotificacion = async (option: { token: string; data: NewNoti }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'POST',
    url: '/notificacion',
    data: option.data,
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
