/* eslint-disable react/react-in-jsx-scope */
import { Line } from 'react-chartjs-2';
import {
  Box,
  TextField,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  colors,
  CircularProgress,
} from '@material-ui/core';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  fechas: string[] | undefined;
  gastos: number[] | undefined;
  gastosMesAnterior: number[] | undefined;
  setDateFetch: Dispatch<SetStateAction<string>>;
  Loading: boolean;
}

export const GraficoGastos = ({
  fechas,
  gastos,
  gastosMesAnterior,
  setDateFetch,
  Loading,
}: Props) => {
  const theme = useTheme();

  const data = {
    datasets: [
      {
        backgroundColor: '#fec4d2',
        data: gastos,
        label: 'Gastos del mes anterior',
      },
      {
        backgroundColor: colors.grey[200],
        data: gastosMesAnterior,
        label: 'Gastos del mes actual',
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
      <Box display='flex' justifyContent='space-between'>
        <CardHeader title='' />
        <TextField
          id='date'
          label='Mes'
          type='month'
          onChange={event => setDateFetch(event.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      <Divider />
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
