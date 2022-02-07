/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { Container, makeStyles, Box, CircularProgress, Button } from '@material-ui/core';
import Page from '../components/page';
import { useContext, useEffect, useState } from 'react';
import { EmpresaUser, MeContext } from '../context/contextMe';
import Calendar from 'react-awesome-calendar';
import {
  GenerateFileCalendar,
  GetCalendarPaymentAndLotery,
  ReGenerateCalendar,
} from '../api/calendar';
import { toast } from 'react-toast';
import { AxiosError } from 'axios';
import { HandleError } from '../helpers/handleError';
import { CalendarPaymentAndLotey } from '../interfaces/Calendar';
import { Alert, AlertTitle } from '@material-ui/lab';
import { BASE_API_FILE_DOCUMENT } from '../api';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fafafa',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  title: {
    float: 'right',
    marginBottom: 10,
    color: theme.palette.secondary.main,
  },
}));

const CalendarView = () => {
  const classes = useStyles();
  const { token, me } = useContext(MeContext);
  const [Loading, setLoading] = useState<boolean>(false);
  const [LoadingReGenerate, setLoadingReGenerate] = useState<boolean>(false);
  const [LoadingFileGenerate, setLoadingFileGenerate] = useState<boolean>(false);
  const [Events, setEvents] = useState<CalendarPaymentAndLotey[]>([]);

  const fetchCalendar = async () => {
    setLoading(true);

    try {
      const { calendarPL } = await (await GetCalendarPaymentAndLotery({ token })).data;
      setEvents(calendarPL);
      setLoading(false);

      if (!calendarPL || !calendarPL.length) {
        toast.error('No se encontro registros en calendario');
        toast.error('Le aconsejamos que vuelva ha generar el calendario');
      }
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  const HandleReGenerate = async () => {
    setLoadingReGenerate(true);
    setLoading(true);

    try {
      await ReGenerateCalendar({ token });

      setTimeout(() => {
        fetchCalendar();
        setLoadingReGenerate(false);
      }, 10000);

      toast.info('Por favor espere un momento hasta re generar todo el calendario');
      toast.info(
        'En caso de terminar el proceso y aun asi no muestra datos, recarga la pagina cada 2 minutos',
      );
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoadingReGenerate(false);
      setLoading(false);
    }
  };

  const HandleFileGenerate = async () => {
    setLoadingFileGenerate(true);

    try {
      const { file } = await (
        await GenerateFileCalendar({ token, empresa: me.empresa as EmpresaUser })
      ).data;
      file &&
        window.open(
          `${BASE_API_FILE_DOCUMENT}/doc/${file}`,
          'Calendario de pagos y sorteo',
          'width=700, height=500',
        );
      setLoadingFileGenerate(false);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoadingFileGenerate(false);
    }
  };

  return (
    <Page className={classes.root} title='Calendario'>
      <Container maxWidth='xl'>
        <Box display='flex' justifyContent='flex-end'>
          <Button
            disabled={LoadingReGenerate || Loading}
            color='secondary'
            variant='contained'
            onClick={HandleReGenerate}
          >
            Volver a generar registros de calendario
          </Button>
          &nbsp; &nbsp;
          <a
            target='_blank'
            rel='noreferrer'
            href={`${BASE_API_FILE_DOCUMENT}/doc/calendario-${me.empresa?.toUpperCase()}-de-pagos-sorteos-${new Date().getFullYear()}.pdf`}
          >
            <Button disabled={LoadingFileGenerate} color='primary' variant='outlined'>
              Ver Calendario en PDF
            </Button>
          </a>
          &nbsp; &nbsp;
          <Button
            disabled={LoadingFileGenerate}
            onClick={HandleFileGenerate}
            color='primary'
            variant='outlined'
          >
            Generar Calendario en PDF
          </Button>
        </Box>
        <Box mt={3} p={3} alignItems='center'>
          <h2 className={classes.title}>Calendario de pagos y sorteos</h2>
          <br />
          {Loading ? <CircularProgress color='primary' /> : <Calendar events={Events} />}
        </Box>

        <br />

        <Alert severity='warning'>
          <AlertTitle>Atención</AlertTitle>
          En el presente calendario se mostrara los días de pagos y sorteos correspondientes del año
          presente, estos registros sirven para validar los pagos de creditos y generar el
          Calendario en formato PDF.
          <br />
          <br />
          Estos registros son actualizados automáticamente cada 1 de enero a las 1 a.m., cada vez se
          se genere por favor entrar a este modulo para verificar los datos.
          <br />
          <br />
          En tal caso que no exista registro alguno puede re generar todo manualmente, ten en cuenta
          que estos datos necesitan existir ya que en caso contrario el sistema no podría funcionar
          Con normalidad.
        </Alert>
      </Container>
    </Page>
  );
};

export default CalendarView;
