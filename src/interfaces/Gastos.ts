export interface Gastos {
  idCajaChica: string;
  concepto: string;
  egresos: number | null;
  created_at: string | Date;
  idSucursal: string;
  active: number;
  observaciones: string | null;
}

export interface GastoStatistics {
  fechas: string[];
  gastos: number[];
  gastosMesAnterior: number[];
}
