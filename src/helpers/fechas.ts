export const monthDiff = (options: { desde: Date; hasta: Date }) => {
  let months;
  months = (options.hasta.getFullYear() - options.desde.getFullYear()) * 12;
  months -= options.desde.getMonth() + 1;
  months += options.hasta.getMonth();
  return months <= 0 ? 0 : months;
};
