import { Usuario } from './Usuario';

export interface ErrorApp {
  idError: string;
  idUser: string;
  asunto: string;
  descripcion: string;
  created_at: string | Date;
  estado: 'Pendiente' | 'Atendido' | 'En proceso';
  source: string | null;
}

export interface ErrorAppByUser extends ErrorApp {
  user: Usuario;
}
