export interface Cliente {
  idCliente: string;
  nombres: string;
  apellidos: string;
  telefono: number;
  fecha_nacimiento: string | Date;
  created_at: string | Date;
  email: string;
  active: number;
  ciudad: string;
  direccion: string;
  sexo: 'Masculino' | 'Femenino';
}
