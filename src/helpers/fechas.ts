/* eslint-disable prefer-const */
export const monthDiff = (options: { desde: Date; hasta: Date }) => {
  let months;
  months = (options.hasta.getFullYear() - options.desde.getFullYear()) * 12;
  months -= options.desde.getMonth() + 1;
  months += options.hasta.getMonth();
  return months <= 0 ? 0 : months;
};

export const CurrentDate = (myDate?: Date) => {
  const date = myDate || new Date();
  let mes: string | number = date.getMonth() + 1;
  let dia: string | number = date.getDate();

  if (mes < 10) {
    mes = '0' + mes;
  }

  if (dia < 10) {
    dia = '0' + dia;
  }

  return date.getFullYear() + '-' + mes + '-' + dia;
};

export const SubDate = (options: { myDate?: Date; days: number }) => {
  const { myDate, days } = options;
  let diasPasados;

  if (myDate) {
    diasPasados = myDate.getDate() - days;
  } else {
    diasPasados = new Date().getDate() - days;
  }
  const semanaPasadaSecon = new Date().setDate(diasPasados);
  return new Date(semanaPasadaSecon);
};

export const AddDate = (options: { myDate?: Date; days: number }) => {
  let { myDate, days } = options;

  if (days < 0) {
    days = 0;
  }

  let diasProximos;

  if (myDate) {
    diasProximos = myDate.getDate() + days;
  } else {
    diasProximos = new Date().getDate() + days;
  }
  const newSecon = new Date().setDate(diasProximos);
  return new Date(newSecon);
};

export const GetMonth = (date: string | Date) => {
  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const indexMonth = new Date(date).getMonth();

  return meses[indexMonth];
};
