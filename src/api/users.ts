/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-undef */
import { api } from '.';

interface LoginUser {
  email: string;
  password: string;
}

export interface UpdateMeUser {
  email: string;
  userName?: string;
  nombres: string;
  apellidos: string;
}

interface NewUsers {
  email: string;
  userName: string;
  password: string;
  nombres: string;
  apellidos: string;
  idRol: string;
  sexo: string;
  razonSocial: string;
  idSucursal: string;
  fechaNacimiento: Date | string;
  idSupervisor: string;
}

export const GetUsers = async (option: { token?: string; findUser?: string; page: number }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: `${
      option.findUser
        ? `/users?findUser=${option.findUser}&page=${option.page}`
        : `/users?page=${option.page}`
    }`,
  });
  return response;
};

export const GetUser = async (option: { token: string | undefined; idUser: string }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'GET',
    url: `/users/${option.idUser}`,
  });
  return response;
};

export const LoginAccess = async (option: { token?: string; data: LoginUser }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'POST',
    url: '/users/login',
    data: option.data,
  });
  return response;
};

export const GetMeUser = async (options: { token: string | undefined }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'GET',
    url: '/users/me',
  });
  return response;
};

export const GetSupervidoresUser = async (options: { token: string }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'GET',
    url: '/users/supervisores',
  });
  return response;
};

export const GetNotRolUser = async (options: { token: string }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'GET',
    url: '/users/referencia-rol',
  });
  return response;
};

export const GetUserByRol = async (options: {
  token: string;
  name: string;
  idSucursal?: string;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'GET',
    url: `/users/rol/${options.name}?idSucursal=${options.idSucursal || ''}`,
  });
  return response;
};

export const GetAsesoresDisponiblesUser = async (options: {
  token: string;
  idSucursal?: string;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'GET',
    url: `/users/asesores/available?idSucursal=${options.idSucursal || ''}`,
  });
  return response;
};

export const GetMisAsesoresUser = async (options: { token: string }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'GET',
    url: '/users/mis-asesores',
  });
  return response;
};

export const NewUser = async (options: { token: string; data: NewUsers; idReferido?: string }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'POST',
    url: '/users',
    data: {
      ...options.data,
      idReferido: options.idReferido,
    },
  });
  return response;
};

export const AssignAsesores = async (options: {
  token: string;
  Supervisor: string;
  AsesoresId: string[];
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'POST',
    url: '/users/assign',
    data: {
      Supervisor: options.Supervisor,
      AsesoresId: options.AsesoresId,
    },
  });
  return response;
};

export const UpdateNullAssignAsesores = async (options: {
  token: string;
  AsesoresId: string[];
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'PUT',
    url: '/users/assign/remove',
    data: {
      AsesoresId: options.AsesoresId,
    },
  });
  return response;
};

export const UpdateUser = async (options: { token: string; data: UpdateMeUser }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'PUT',
    url: '/users/me',
    data: options.data,
  });
  return response;
};

export const UpdateAvatarUser = async (options: { token: string | undefined; data: FormData }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'PUT',
    url: '/users/avatar',
    data: options.data,
  });
  return response;
};

export const UpdatePasswordUser = async (options: {
  token: string | undefined;
  currentKey: string;
  newKey: string;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'PUT',
    url: '/users/password',
    data: {
      newKey: options.newKey,
      currentKey: options.currentKey,
    },
  });
  return response;
};

export const UpdateRolUser = async (options: { token?: string; idRol: string; idUser: string }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'PUT',
    url: `/users/rol/${options.idUser}`,
    data: {
      idRol: options.idRol,
    },
  });
  return response;
};

export const UpdatePasswordEmail = async (options: {
  token?: string;
  newKey: string;
  email: string;
}) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'PUT',
    url: `/users/password/reset/${options.email}`,
    data: {
      newKey: options.newKey,
    },
  });
  return response;
};

export const UpdateActiveUser = async (option: {
  token?: string;
  active: boolean;
  IdUser: string;
}) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'PUT',
    data: {
      active: option.active,
    },
    url: `/users/active/${option.IdUser}`,
  });
  return response;
};

export const DeleteUser = async (options: { token?: string; IdUser: string }) => {
  api.defaults.headers['access-token'] = options.token;
  const response = await api({
    method: 'DELETE',
    url: `/users/${options.IdUser}`,
  });
  return response;
};

export const DeleteMultiUser = async (option: { token?: string; IdsUser: string[] }) => {
  api.defaults.headers['access-token'] = option.token;
  const response = await api({
    method: 'DELETE',
    url: '/users/multiple',
    data: {
      idsUser: option.IdsUser,
    },
  });
  return response;
};
