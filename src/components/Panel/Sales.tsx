/* eslint-disable react/react-in-jsx-scope */
import { Line } from 'react-chartjs-2';
import {
  Box,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  colors,
  CircularProgress,
} from '@material-ui/core';
import { Dispatch, SetStateAction } from 'react';
import { FetchByDate } from '../../view/mis-comision';
import { CurrentDate, SubDate } from '../../helpers/fechas';
import { toast } from 'react-toast';

interface Props {
  fechas: string[] | undefined;
  ventas: number[] | undefined;
  comision: number[] | undefined;
  setDateFetch: Dispatch<SetStateAction<FetchByDate>>;
  dateFetch: FetchByDate;
  Loading: boolean;
}

const Sales = ({ fechas, ventas, comision, setDateFetch, dateFetch, Loading }: Props) => {
  const theme = useTheme();

  const data = {
    datasets: [
      {
        backgroundColor: '#fec4d2',
        data: ventas,
        label: 'Ventas',
      },
      {
        backgroundColor: colors.grey[200],
        data: comision,
        label: 'Comision',
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
    <Card>
      <Box display='flex' justifyContent='space-between'>
        <CardHeader title='Ventas' />
        <Box>
          <TextField
            id='date1'
            label='Desde'
            type='date'
            defaultValue={CurrentDate(SubDate({ days: 7 }))}
            onChange={event => setDateFetch({ ...dateFetch, dateDesde: event.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            id='date2'
            label='Hasta'
            style={{ marginLeft: 20 }}
            type='date'
            defaultValue={CurrentDate()}
            onChange={event => {
              if (!dateFetch.dateDesde) {
                toast.error('Selecciona primero la fecha de DESDE');
                return;
              }

              if (
                new Date(dateFetch.dateDesde).getTime() > new Date(event.target.value).getTime()
              ) {
                toast.error('La fecha DESDE tiene que ser menor que la fecha HASTA');
                return;
              }

              setDateFetch({ ...dateFetch, dateHasta: event.target.value });
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
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
    </Card>
  );
};

export default Sales;
