export interface Usuario {
  idUser: string;
  nombres: string;
  apellidos: string;
  userName: string;
  email: string;
  active: number;
  created_at: string | Date;
  avatar: string;
  idRol: string;
}
