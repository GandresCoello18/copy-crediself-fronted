/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/react-in-jsx-scope */
import Cookies from 'js-cookie';
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';

interface Me {
  idUser: string;
  nombres: string;
  apellidos: string;
  userName?: string;
  email: string;
  created_at: Date | string;
  avatar: string;
  active: number;
  idRol: string;
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
};

interface Props {
  children: ReactNode;
}

interface Values {
  token: string;
  me: Me;
  setMe: Dispatch<SetStateAction<Me>>;
}

export const MeContext = createContext<Values>({
  token: '',
  me: templeate,
  setMe: () => false,
});

export const MeContextProvider = ({ children }: Props) => {
  const [token] = useState<string>(Cookies.get('access-token-crediself') || '');
  const [me, setMe] = useState<Me>(templeate);

  const Values: Values = {
    token,
    me,
    setMe,
  };

  return <MeContext.Provider value={Values}>{children}</MeContext.Provider>;
};
