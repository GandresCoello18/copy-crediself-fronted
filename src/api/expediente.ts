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
