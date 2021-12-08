export const monthDiff = (options: { desde: Date; hasta: Date }) => {
  let months;
  months = (options.hasta.getFullYear() - options.desde.getFullYear()) * 12;
  months -= options.desde.getMonth() + 1;
  months += options.hasta.getMonth();
  return months <= 0 ? 0 : months;
};

export const CurrentDate = (notDay?: boolean) => {
  const date = new Date();
  let mes: string | number = date.getMonth() + 1;
  let dia: string | number = date.getDate();

  if (mes < 10) {
    mes = '0' + mes;
  }

  if (dia < 10) {
    dia = '0' + dia;
  }

  if (notDay) {
    return date.getFullYear() + '-' + mes;
  }

  return date.getFullYear() + '-' + mes + '-' + dia;
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
