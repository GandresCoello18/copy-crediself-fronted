export const monthDiff = (options: { desde: Date; hasta: Date }) => {
  let months;
  months = (options.hasta.getFullYear() - options.desde.getFullYear()) * 12;
  months -= options.desde.getMonth() + 1;
  months += options.hasta.getMonth();
  return months <= 0 ? 0 : months;
};

export const CurrentDate = () => {
  const date = new Date();
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
