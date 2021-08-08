export interface TimeMessage {
  id_time_message: string;
  destination: string;
  subject: 'Recuperar Contraseña';
  created_at: string | Date;
  life_minutes: number;
  status?: 'En progreso' | 'Expirado';
}
