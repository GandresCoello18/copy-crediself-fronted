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
  sexo: 'Masculino' | 'Femenino';
  fecha_nacimiento: Date | string;
  razon_social: string;
  idSucursal: string | null;
}

export interface Supervisor {
  avatar: string;
  nombres: string;
  apellidos: string;
  idUser: string;
}

export interface Asesores {
  avatar: string;
  nombres: string;
  apellidos: string;
  idUser: string;
}

export interface UsuarioAsignacion extends Usuario {
  supervidor: Supervisor | null;
  asesores: Asesores[];
}
