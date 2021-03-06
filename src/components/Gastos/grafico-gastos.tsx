/* eslint-disable react/react-in-jsx-scope */
import { Line } from 'react-chartjs-2';
import { Box, CardContent, useTheme, colors, CircularProgress } from '@material-ui/core';

interface Props {
  fechas: string[] | undefined;
  gastos: number[] | undefined;
  gastosMesAnterior: number[] | undefined;
  Loading: boolean;
}

export const GraficoGastos = ({ fechas, gastos, gastosMesAnterior, Loading }: Props) => {
  const theme = useTheme();

  const data = {
    datasets: [
      {
        backgroundColor: '#fec4d2',
        data: gastos,
        label: 'Gastos del mes actual',
      },
      {
        backgroundColor: colors.grey[200],
        data: gastosMesAnterior,
        label: 'Gastos del mes anterior',
      },
    ],
    labels: fechas,
  };

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          barThickness: 12,
          maxBarThickness: 10,
          barPercentage: 0.5,
          categoryPercentage: 0.5,
          ticks: {
            fontColor: theme.palette.text.primary,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.primary,
            beginAtZero: true,
            min: 0,
          },
          gridLines: {
            borderDash: [8],
            borderDashOffset: [2],
            color: theme.palette.primary,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider,
          },
        },
      ],
    },
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.primary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary,
    },
  };

  return (
    <div style={{ width: '100%' }}>
      <CardContent>
        <Box height={400} position='relative'>
          {Loading ? (
            <CircularProgress color='secondary' />
          ) : (
            <Line data={data} options={options} />
          )}
        </Box>
      </CardContent>
    </div>
  );
};
