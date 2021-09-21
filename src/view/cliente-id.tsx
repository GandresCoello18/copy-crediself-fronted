/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import {
  Container,
  makeStyles,
  Box,
  Grid,
  Divider,
  Avatar,
  Typography,
  Switch,
  Button,
} from '@material-ui/core';
import Page from '../components/page';
import { useState, useEffect, useContext } from 'react';
import { MeContext } from '../context/contextMe';
import { toast } from 'react-toast';
import { useParams } from 'react-router';
import { AxiosError } from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { HandleError } from '../helpers/handleError';
import { DialogoForm } from '../components/DialogoForm';
import { DeleteCliente, GetCliente, UpdateActiveCliente } from '../api/clientes';
import { Cliente, Expediente } from '../interfaces/Cliente';
import { SourceAvatar } from '../helpers/sourceAvatar';
import { Alert, Skeleton } from '@material-ui/lab';
import { DialogoMessage } from '../components/DialogoMessage';
import { UploadExpediente } from '../components/cliente/upload-expediente';
import { FormUpdateCliente } from '../components/cliente/update-client';
import { CardFile } from '../components/cliente/card-file';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#f2f2f2',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  avatar: {
    height: 100,
    width: 100,
  },
  bgWhite: {
    backgroundColor: '#fff',
  },
  btnDelete: {
    borderColor: 'red',
    color: 'red',
  },
  btnEdit: {
    borderColor: 'orange',
    color: 'orange',
  },
  subTitle: {
    color: '#696969',
  },
  cardNumber: {
    padding: 25,
    borderRight: '1px solid #cdcdcd',
    textAlign: 'center',
  },
  cardNumberValue: {
    fontSize: 30,
    marginTop: 10,
    color: theme.palette.primary.main,
  },
  textTop: {
    marginTop: 5,
  },
  containerDetails: { backgroundColor: '#fff', borderTopLeftRadius: 10, borderTopRightRadius: 10 },
}));

interface NumbersDetails {
  creditos: number;
  pagos: number;
  archivos: number;
}

const ClientOnlyView = () => {
  const params = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const { token, me } = useContext(MeContext);
  const [Archivos, setArchivos] = useState<Expediente[]>([]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [Numbers, setNumbers] = useState<NumbersDetails>({
    creditos: 0,
    pagos: 0,
    archivos: 0,
  });
  const [Cliente, setCliente] = useState<Cliente | undefined>(undefined);
  const [Loading, setLoading] = useState<boolean>(false);
  const [VisibleUpdate, setVisibleUpdate] = useState<boolean>(false);
  const [AceptDialog, setAceptDialog] = useState<boolean>(false);
  const [DialogoDelete, setDialogoDelete] = useState<boolean>(false);
  const [ReloadCliente, setReloadCliente] = useState<boolean>(false);

  const fetchClient = async () => {
    setLoading(true);

    try {
      const { cliente, numbers, expediente } = await (
        await GetCliente({ token, IdCliente: params.idCliente })
      ).data;

      setCliente(cliente);
      setArchivos(expediente);
      setLoading(false);
      setNumbers(numbers);

      if (cliente) {
        setIsActive(cliente.active);
      }
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    params.idCliente && fetchClient();

    if (ReloadCliente) {
      setReloadCliente(false);
    }
  }, [params, ReloadCliente]);

  useEffect(() => {
    const FetchDelete = async () => {
      try {
        await DeleteCliente({ token, IdCliente: params.idCliente });
        toast.success('Cliente eliminado');

        setAceptDialog(false);
        setDialogoDelete(false);

        navigate('/app/clientes');
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
      }
    };

    AceptDialog && params.idCliente && FetchDelete();
  }, [AceptDialog, token, params]);

  const handleActive = async (check: boolean) => {
    setLoading(true);

    try {
      await UpdateActiveCliente({ token, active: check, idCliente: params.idCliente });
      setLoading(false);
      setIsActive(check);
    } catch (error) {
      setLoading(false);
      toast.error(HandleError(error as AxiosError));
    }
  };

  const RenderDetailsClient = () => {
    return (
      <Grid container spacing={3} justify='space-around'>
        <Grid item xs={12} md={4} className={classes.bgWhite}>
          <h4>Información</h4>
          <br />
          <Divider />
          <br />
          <Box alignItems='center' display='flex' flexDirection='column'>
            {Loading ? (
              <Skeleton variant='circle' width={100} height={100} />
            ) : (
              <Avatar className={classes.avatar} src={SourceAvatar('')} />
            )}
          </Box>
          <Box mt={2}>
            <strong className={classes.subTitle}>Nombres</strong>
            {Loading ? (
              <Skeleton variant='text' width={300} height={20} />
            ) : (
              <Typography className={classes.textTop}>{Cliente?.nombres}</Typography>
            )}
          </Box>

          <Box mt={2}>
            <strong className={classes.subTitle}>Apellidos</strong>
            {Loading ? (
              <Skeleton variant='text' width={300} height={20} />
            ) : (
              <Typography className={classes.textTop}>{Cliente?.apellidos}</Typography>
            )}
          </Box>

          <Box mt={2}>
            <strong className={classes.subTitle}>Email</strong>
            {Loading ? (
              <Skeleton variant='text' width={300} height={20} />
            ) : (
              <Typography className={classes.textTop}>{Cliente?.email}</Typography>
            )}
          </Box>

          <Box mt={2}>
            <strong className={classes.subTitle}>Telefono</strong>
            {Loading ? (
              <Skeleton variant='text' width={300} height={20} />
            ) : (
              <Typography className={classes.textTop}>{Cliente?.telefono}</Typography>
            )}
          </Box>

          <Box mt={2}>
            <strong className={classes.subTitle}>Nacimiento</strong>
            {Loading ? (
              <Skeleton variant='text' width={300} height={20} />
            ) : (
              <Typography className={classes.textTop}>{Cliente?.fecha_nacimiento}</Typography>
            )}
          </Box>

          <Box mt={2}>
            <strong className={classes.subTitle}>Activo</strong>
            {Loading ? (
              <Skeleton variant='text' width={100} height={20} />
            ) : (
              <Switch
                checked={isActive}
                disabled={me.idRol !== 'Gerente de Sucursal'}
                onChange={value => handleActive(value.target.checked)}
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            )}
          </Box>

          <Box mt={2}>
            <strong className={classes.subTitle}>RFC</strong>
            {Loading ? (
              <Skeleton variant='text' width={300} height={20} />
            ) : (
              <Typography className={classes.textTop}>{Cliente?.rfc}</Typography>
            )}
          </Box>

          <Box mt={2}>
            <strong className={classes.subTitle}>Sexo</strong>
            {Loading ? (
              <Skeleton variant='text' width={300} height={20} />
            ) : (
              <Typography className={classes.textTop}>{Cliente?.sexo}</Typography>
            )}
          </Box>

          <Box mt={2}>
            <strong className={classes.subTitle}>Ciudad</strong>
            {Loading ? (
              <Skeleton variant='text' width={300} height={20} />
            ) : (
              <Typography className={classes.textTop}>{Cliente?.ciudad}</Typography>
            )}
          </Box>

          <Box mt={2}>
            <strong className={classes.subTitle}>Dirección</strong>
            {Loading ? (
              <Skeleton variant='text' width={500} height={100} />
            ) : (
              <Typography className={classes.textTop}>{Cliente?.direccion}</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={7} className={classes.bgWhite}>
          <h4>Más Datos</h4>
          <br />
          <Divider />
          <br />

          <Grid container justify='space-between'>
            <Grid className={classes.cardNumber} xs={12} md={3}>
              <h3 className={classes.subTitle}>Cliente #</h3>
              {Loading ? (
                <Skeleton variant='text' width='100%' height={15} />
              ) : (
                <strong className={classes.cardNumberValue}>{Cliente?.numeroCliente}</strong>
              )}
            </Grid>
            <Grid className={classes.cardNumber} xs={12} md={3}>
              <h3 className={classes.subTitle}>Creditos</h3>
              {Loading ? (
                <Skeleton variant='text' width='100%' height={15} />
              ) : (
                <strong className={classes.cardNumberValue}>{Numbers.creditos}</strong>
              )}
            </Grid>
            <Grid className={classes.cardNumber} xs={12} md={3}>
              <h3 className={classes.subTitle}>Pagos</h3>
              {Loading ? (
                <Skeleton variant='text' width='100%' height={15} />
              ) : (
                <strong className={classes.cardNumberValue}>{Numbers.pagos}</strong>
              )}
            </Grid>
            <Grid className={classes.cardNumber} xs={12} md={3}>
              <h3 className={classes.subTitle}>Archivos</h3>
              {Loading ? (
                <Skeleton variant='text' width='100%' height={15} />
              ) : (
                <strong className={classes.cardNumberValue}>{Numbers.archivos}</strong>
              )}
            </Grid>
          </Grid>

          <br />
          <Divider />
          <br />
          <h4>Comprobantes</h4>
          <br />
          <Divider />
          <br />

          <Grid container justify='space-between'>
            {!Loading && !Archivos.length && (
              <Alert color='info'>No hay archivos en el expediente</Alert>
            )}
            {Loading
              ? [1, 2, 3].map(item => (
                  <Grid key={item} style={{ padding: 10 }} xs={12} md={4}>
                    <Skeleton variant='rect' width='100%' height={215} />
                    <br />
                    <Skeleton variant='text' width='100%' height={25} />
                  </Grid>
                ))
              : Archivos.map(item => (
                  <Grid
                    key={item.idExpedienteClient}
                    style={{ textAlign: 'center', padding: 10 }}
                    xs={12}
                    md={4}
                  >
                    <CardFile file={item} token={token} setReloadCliente={setReloadCliente} />
                  </Grid>
                ))}
            <Grid item xs={12}>
              <br />
              <UploadExpediente
                token={token}
                idCliente={params.idCliente}
                setReloadCliente={setReloadCliente}
              />
            </Grid>
          </Grid>

          <br />
          <Divider />
          <br />
          <h4>Acciones</h4>
          <br />
          <Divider />
          <br />

          <Grid container spacing={3} justify='space-around'>
            <Grid item>
              <Link to={`/app/creditos/cliente/${Cliente?.idCliente}`}>
                <Button variant='outlined'>Ver Creditos</Button>
              </Link>
            </Grid>
            <Grid item>
              <Button variant='outlined'>Estado de cuenta</Button>
            </Grid>
            <Grid item>
              <Button
                variant='outlined'
                onClick={() => setVisibleUpdate(true)}
                className={classes.btnEdit}
              >
                Editar
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant='outlined'
                onClick={() => setDialogoDelete(true)}
                className={classes.btnDelete}
              >
                Eliminar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <Page className={classes.root} title='Detalles de Cliente'>
      <Container maxWidth='xl'>
        <Box mt={3}>{RenderDetailsClient()}</Box>
      </Container>

      <DialogoMessage
        title='Aviso importante'
        Open={DialogoDelete}
        setOpen={setDialogoDelete}
        setAceptDialog={setAceptDialog}
        content='¿Esta seguro que deseas eliminar este registro?, una vez hecho sera irrecuperable.'
      />

      <DialogoForm Open={VisibleUpdate} setOpen={setVisibleUpdate} title=''>
        {Cliente && (
          <FormUpdateCliente
            setReloadCliente={setReloadCliente}
            cliente={Cliente}
            setVisible={setVisibleUpdate}
          />
        )}
      </DialogoForm>
    </Page>
  );
};

export default ClientOnlyView;
