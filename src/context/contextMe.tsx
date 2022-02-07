/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/react-in-jsx-scope */
import Cookies from 'js-cookie';
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';

export type EmpresaUser = 'AUTOIMPULZADORA' | 'CREDISELF';
export interface Me {
  idUser: string;
  nombres: string;
  apellidos: string;
  userName?: string;
  email: string;
  created_at: Date | string;
  avatar: string;
  active: number;
  idRol: string;
  idSucursal: string;
  supervisor: string;
  empresa?: EmpresaUser;
}

const templeate: Me = {
  idUser: '',
  nombres: '',
  apellidos: '',
  userName: '',
  email: '',
  created_at: '',
  avatar: '',
  active: 0,
  idRol: '',
  idSucursal: '',
  supervisor: '',
  empresa: undefined,
};

interface Props {
  children: ReactNode;
}

interface Values {
  token: string;
  me: Me;
  setMe: Dispatch<SetStateAction<Me>>;
  setToken: Dispatch<SetStateAction<string>>;
}

export const MeContext = createContext<Values>({
  token: '',
  me: templeate,
  setMe: () => false,
  setToken: () => false,
});

export const MeContextProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string>(Cookies.get('access-token-crediself') || '');
  const [me, setMe] = useState<Me>(templeate);

  const Values: Values = {
    token,
    me,
    setMe,
    setToken,
  };

  return <MeContext.Provider value={Values}>{children}</MeContext.Provider>;
};
