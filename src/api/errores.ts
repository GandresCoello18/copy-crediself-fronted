import { api } from '.';

export const NewErrorApp = async (options: { token: string; data: FormData }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'POST',
    url: '/error',
    data: options.data,
  });
  return response;
};

export const GetErrorApp = async (options: { token: string; findError?: string; page: number }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'GET',
    url: `/error/user?findError=${options?.findError || ''}&page=${options.page}`,
  });
  return response;
};

export const RemoveErrorApp = async (options: { token: string; idError: string }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'DELETE',
    url: `/error/user/${options.idError}`,
  });
  return response;
};
