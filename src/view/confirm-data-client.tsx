/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/react-in-jsx-scope */
import {
  Container,
  Box,
  CircularProgress,
  makeStyles,
  Card,
  Typography,
  CardContent,
  Button,
  Grid,
} from '@material-ui/core';
import { AxiosError } from 'axios';
import { useParams } from 'react-router';
import { toast } from 'react-toast';
import Page from '../components/page';
import { useState, useEffect, useContext } from 'react';
import { HandleError } from '../helpers/handleError';
import { TimeMessage } from '../interfaces/Time-Message';
import { getTimeMessage } from '../api/time-message';
import { MeContext } from '../context/contextMe';
import { Cliente } from '../interfaces/Cliente';
import { GetConfirmDataCliente, UpdatecheckDataClient } from '../api/clientes';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#f2f2f2',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  center: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backCard: {
    borderWidth: 2,
    borderRadius: 10,
    borderStyle: 'solid',
    borderColor: theme.palette.primary.main,
  },
  field: {
    color: '#696969',
  },
  card: {
    padding: 30,
  },
  title: theme.typography.h3,
}));

const ConfirmDataClient = () => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingConfir, setLoadingConfir] = useState<boolean>(false);
  const [TimeProgres, setTimeProgres] = useState<TimeMessage | undefined>(undefined);
  const [Cliente, setCliente] = useState<Cliente | undefined>(undefined);

  const FetchClient = async () => {
    try {
      const { cliente } = await (await GetConfirmDataCliente({ IdCliente: params.idCliente })).data;
      setCliente(cliente);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
    }
  };

  const FetchTimeMessage = async () => {
    setLoading(true);

    try {
      const { message } = await (await getTimeMessage({ token, idMessage: params.idTimeMessage }))
        .data;
      setTimeProgres(message);

      if (message && message?.status === 'En progreso' && params.idCliente) {
        FetchClient();
      }

      setLoading(false);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  const HandleConfirData = async () => {
    setLoadingConfir(true);

    try {
      await UpdatecheckDataClient({ idCliente: params.idCliente, check: true });
      setLoadingConfir(false);
      toast.success('Se registro su confirmación con exito');
      FetchTimeMessage();
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoadingConfir(false);
    }
  };

  useEffect(() => {
    params.idTimeMessage && FetchTimeMessage();
  }, [params]);

  const NotDataFind = () => {
    return (
      <Card>
        <CardContent>
          <Typography className={classes.title}>🥴 Upps...!!</Typography>
          <br />
          <Typography>No se encontraron datos, revise que la dirección este correcto</Typography>
        </CardContent>
      </Card>
    );
  };

  const TimeExpired = () => {
    return (
      <Card>
        <CardContent>
          <Typography className={classes.title}>🕗 Tiempo agotado...!!</Typography>
          <br />
          <Typography>
            El tiempo para confirmar tus datos ha sido agotado, por favor solicite una nueva
            solicitud de confirmación.
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const RenderDataClient = () => {
    return (
      <>
        <Typography className={classes.title}>👱 Revisa tus datos</Typography>
        <br />
        <Typography>
          El tiempo para confirmar tus datos es de{' '}
          <strong>{TimeProgres?.life_minutes} minutos</strong>, por favor revise y confirme si estan
          correctos, de lo contrario puedes contactarte al <strong>08545855484</strong>.
        </Typography>

        <br />
        <br />

        <Grid className={classes.backCard} container spacing={3} justify='space-around'>
          <Grid item xs={12} md={5}>
            <strong className={classes.field}>Nombres</strong>
            <br />
            {Cliente?.nombres || '(No registrado)'}
          </Grid>
          <Grid item xs={12} md={5}>
            <strong className={classes.field}>Apellidos</strong>
            <br />
            {Cliente?.apellidos || '(No registrado)'}
          </Grid>
          <Grid item xs={12} md={5}>
            <strong className={classes.field}>Dirección de correo</strong>
            <br />
            {Cliente?.email || '(No registrado)'}
          </Grid>
          <Grid item xs={12} md={5}>
            <strong className={classes.field}>Telefono</strong>
            <br />
            {Cliente?.telefono || '(No registrado)'}
          </Grid>
          <Grid item xs={12} md={5}>
            <strong className={classes.field}>Fecha de nacimiento</strong>
            <br />
            {Cliente?.fecha_nacimiento || '(No registrado)'}
          </Grid>
          <Grid item xs={12} md={5}>
            <strong className={classes.field}>Sexo</strong>
            <br />
            {Cliente?.sexo || '(No registrado)'}
          </Grid>
          <Grid item xs={12} md={5}>
            <strong className={classes.field}>Rfc</strong>
            <br />
            {Cliente?.rfc || '(No registrado)'}
          </Grid>
          <Grid item xs={12} md={5}>
            <strong className={classes.field}>Ciudad</strong>
            <br />
            {Cliente?.ciudad || '(No registrado)'}
          </Grid>
          <Grid item xs={12} md={5}>
            <strong className={classes.field}>Dirección</strong>
            <br />
            {Cliente?.direccion || '(No registrado)'}
          </Grid>
        </Grid>

        <br />
        <br />

        <Button
          color='primary'
          onClick={HandleConfirData}
          disabled={loadingConfir}
          variant='outlined'
          fullWidth
        >
          Confirmar mis datos
        </Button>
      </>
    );
  };

  const CheckClient = () => {
    return (
      <Card>
        <CardContent>
          <Typography className={classes.title}>✅ Cliente revisado y confirmado</Typography>
          <br />
          <Typography>
            Los datos del cliente ya fue revisados y confirmado, si tienes algun problema puedes
            comunicarte al <strong>08545855484</strong>
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const RenderContent = () => {
    if (TimeProgres?.status === 'Expirado') {
      return TimeExpired();
    }

    if (TimeProgres?.status === 'En progreso' && !Cliente) {
      return NotDataFind();
    }

    if (TimeProgres?.status === 'En progreso' && Cliente && Cliente.checkDataClient) {
      return CheckClient();
    }

    if (TimeProgres?.status === 'En progreso' && Cliente) {
      return RenderDataClient();
    }
  };

  return (
    <Page className={classes.root} title='Confirma tus datos'>
      <Container maxWidth='lg'>
        <Box className={classes.center}>
          {loading && <CircularProgress color='primary' />}

          <Box justifyContent='center'>{TimeProgres ? RenderContent() : NotDataFind()}</Box>
        </Box>
      </Container>
    </Page>
  );
};

export default ConfirmDataClient;
