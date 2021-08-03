import { api } from '.';

export const GetRoles = async (option: { token?: string }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: '/rol',
  });
  return response;
};

export const DeleteRole = async (option: { token?: string; IdRol: string }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'DELETE',
    url: `/rol/${option.IdRol}`,
  });
  return response;
};

export const DeleteMultiRole = async (option: { token?: string; IdsRole: string[] }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'DELETE',
    url: '/rol/multiple',
    data: {
      idsRol: option.IdsRole,
    },
  });
  return response;
};

export const UpdateRole = async (option: {
  token?: string;
  descripcion: string;
  IdRol: string;
}) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'PUT',
    data: {
      descripcion: option.descripcion,
    },
    url: `/rol/${option.IdRol}`,
  });
  return response;
};

export const UpdateActiveRol = async (option: {
  token?: string;
  active: boolean;
  IdRol: string;
}) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'PUT',
    data: {
      active: option.active,
    },
    url: `/rol/active/${option.IdRol}`,
  });
  return response;
};
