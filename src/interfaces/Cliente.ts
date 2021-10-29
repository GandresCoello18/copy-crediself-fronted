export interface CheckCliente {
  idUser: string;
  avatar: string | null;
  nombres: string;
  apellidos: string;
}

export interface Cliente {
  idCliente: string;
  nombres: string;
  apellidos: string;
  telefono: number | null;
  fecha_nacimiento: string | Date | null;
  created_at: string | Date;
  email: string;
  active: number;
  ciudad: string | null;
  direccion: string | null;
  sexo: 'Masculino' | 'Femenino' | 'No especificado';
  rfc: string | null;
  numeroCliente: number;
  idUser: string;
  autorizado: CheckCliente;
  checkSupervisor: CheckCliente;
  checkGerenteSuc: CheckCliente;
}

export interface Expediente {
  idExpedienteClient: string;
  comprobanteExp: string;
  sourceExp: string;
  created_at: string | Date;
  idCliente: string;
  kind: 'img' | 'pdf';
}
