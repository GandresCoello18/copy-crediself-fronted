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
  rfc: string;
  numeroCliente: number;
}

export interface Expediente {
  idExpedienteClient: string;
  comprobanteExp: string;
  sourceExp: string;
  created_at: string | Date;
  idCliente: string;
  kind: 'img' | 'pdf';
}
