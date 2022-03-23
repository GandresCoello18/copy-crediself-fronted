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
  CircularProgress,
  Avatar,
  Typography,
  Switch,
  Button,
  Chip,
} from '@material-ui/core';
import Page from '../components/page';
import { useState, useEffect, useContext } from 'react';
import { MeContext } from '../context/contextMe';
import { toast } from 'react-toast';
import { useParams } from 'react-router';
import { AxiosError } from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { HandleError } from '../helpers/handleError';
import BlockIcon from '@material-ui/icons/Block';
import { DialogoForm } from '../components/DialogoForm';
import {
  DeleteCliente,
  GetCliente,
  NotificarDataClient,
  UpdateActiveCliente,
  UpdateAutorizarCliente,
} from '../api/clientes';
import { Cliente, Expediente } from '../interfaces/Cliente';
import { SourceAvatar } from '../helpers/sourceAvatar';
import { Alert, Skeleton } from '@material-ui/lab';
import { DialogoMessage } from '../components/DialogoMessage';
import { UploadExpediente } from '../components/cliente/upload-expediente';
import { FormUpdateCliente } from '../components/cliente/update-client';
import { CardFile } from '../components/cliente/card-file';
import { Usuario } from '../interfaces/Usuario';
import { CheckGerenteSuc } from '../components/cliente/CheckGerenteSuc';
import { CheckeSupervisor } from '../components/cliente/CheckSupervisor';
import { NotificationSupervisor } from '../components/cliente/NotificationSupervisor';

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
  btnEliminar: {
    borderColor: 'red',
    color: 'red',
  },
  subTitle: {
    color: '#696969',
    marginTop: 4,
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
  const [UsuarioRegister, setUsuarioRegister] = useState<Usuario | undefined>(undefined);
  const [Numbers, setNumbers] = useState<NumbersDetails>({
    creditos: 0,
    pagos: 0,
    archivos: 0,
  });
  const [Cliente, setCliente] = useState<Cliente | undefined>(undefined);
  const [Loading, setLoading] = useState<boolean>(false);
  const [LoadingNotificar, setLoadingNotificar] = useState<boolean>(false);
  const [VisibleUpdate, setVisibleUpdate] = useState<boolean>(false);
  const [AceptDialog, setAceptDialog] = useState<boolean>(false);
  const [DialogoDelete, setDialogoDelete] = useState<boolean>(false);
  const [ReloadCliente, setReloadCliente] = useState<boolean>(false);

  const fetchClient = async () => {
    setLoading(true);

    try {
      const { cliente, numbers, expediente, usuario } = await (
        await GetCliente({ token, IdCliente: params.idCliente })
      ).data;

      setCliente(cliente);
      setArchivos(expediente);
      setUsuarioRegister(usuario);
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

  const handleAutorizar = async () => {
    const autorizar = Cliente?.autorizado ? false : true;

    try {
      await UpdateAutorizarCliente({ token, idCliente: params.idCliente, autorizar });
      setReloadCliente(true);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
    }
  };

  const NotificarClient = async () => {
    if (!Cliente?.notificarEmail && !Cliente?.notificarSms) {
      toast.warn('El cliente no tiene preferencia en notificaciones');
      return;
    }

    setLoadingNotificar(true);

    try {
      const { status } = await (await NotificarDataClient({ token, idCliente: params.idCliente }))
        .data;
      setLoadingNotificar(false);
      toast.success('Se notifico al cliente para confirmar sus datos');
      status && toast.error(status);
    } catch (error) {
      setLoadingNotificar(false);
      toast.error(HandleError(error as AxiosError));
    }
  };

  const RenderEdit = () => {
    return (
      <Grid item>
        <Button
          variant='outlined'
          disabled={!Cliente?.active || Loading}
          onClick={() => setVisibleUpdate(true)}
          className={classes.btnEdit}
        >
          Editar
        </Button>
      </Grid>
    );
  };

  const RenderActive = () => {
    return (
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
    );
  };

  const RenderDetailsClient = () => {
    return (
      <Grid container spacing={3} justify='space-around'>
        <Grid item xs={12} md={4} className={classes.bgWhite}>
          <Box display='flex' alignItems='center' justifyContent='space-between'>
            <h4>Información</h4>
            {!Loading && !Cliente?.active && (
              <Chip
                icon={<BlockIcon style={{ color: 'red' }} />}
                label='Desactivado'
                style={{ backgroundColor: '#f4bec3' }}
              />
            )}
          </Box>
          <br />
          <Divider />
          <br />
          <Box alignItems='center' display='flex' justifyContent='center'>
            {Loading ? (
              <Skeleton variant='circle' width={100} height={100} />
            ) : (
              <>
                <Box alignItems='center' display='flex' flexDirection='column' mr={3}>
                  <Avatar
                    title={Cliente?.nombres + ' ' + Cliente?.apellidos}
                    className={classes.avatar}
                    src={SourceAvatar('')}
                  />
                  <span className={classes.subTitle}>Cliente</span>
                </Box>

                <Box alignItems='center' display='flex' flexDirection='column' ml={3}>
                  <Avatar
                    title={UsuarioRegister?.nombres + ' ' + UsuarioRegister?.apellidos}
                    className={classes.avatar}
                    src={SourceAvatar(UsuarioRegister?.avatar || '')}
                  />
                  <span className={classes.subTitle}>{UsuarioRegister?.idRol}</span>
                </Box>
              </>
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
              <Typography className={classes.textTop}>
                {Cliente?.email || <Chip label='No especificado' />}
              </Typography>
            )}
          </Box>

          <Box mt={2}>
            <strong className={classes.subTitle}>Telefono</strong>
            {Loading ? (
              <Skeleton variant='text' width={300} height={20} />
            ) : (
              <Typography className={classes.textTop}>
                {Cliente?.telefono || <Chip label='No especificado' />}
              </Typography>
            )}
          </Box>

          <Box mt={2}>
            <strong className={classes.subTitle}>Nacimiento</strong>
            {Loading ? (
              <Skeleton variant='text' width={300} height={20} />
            ) : (
              <Typography className={classes.textTop}>
                {Cliente?.fecha_nacimiento || <Chip label='No especificado' />}
              </Typography>
            )}
          </Box>

          {!Cliente?.checkSupervisor && me.idRol == 'Supervisor' && RenderActive()}
          {!Cliente?.checkGerenteSuc && me.idRol == 'Gerente de Sucursal' && RenderActive()}
          {me.idRol === 'Administrativo' && RenderActive()}

          <Box mt={2}>
            <strong className={classes.subTitle}>RFC</strong>
            {Loading ? (
              <Skeleton variant='text' width={300} height={20} />
            ) : (
              <Typography className={classes.textTop}>
                {Cliente?.rfc || <Chip label='No especificado' />}
              </Typography>
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
              <Typography className={classes.textTop}>
                {Cliente?.ciudad || <Chip label='No especificado' />}
              </Typography>
            )}
          </Box>

          <Box mt={2}>
            <strong className={classes.subTitle}>Dirección</strong>
            {Loading ? (
              <Skeleton variant='text' width={500} height={100} />
            ) : (
              <Typography className={classes.textTop}>
                {Cliente?.direccion || <Chip label='No especificado' />}
              </Typography>
            )}
          </Box>

          <Box mt={2}>
            <strong className={classes.subTitle}>Datos confirmados por el cliente</strong>
            {Loading ? (
              <Skeleton variant='text' width={300} height={20} />
            ) : (
              <Typography className={classes.textTop}>
                <Chip
                  color={Cliente?.checkDataClient ? 'primary' : 'default'}
                  label={Cliente?.checkDataClient ? 'Si' : 'No'}
                />
              </Typography>
            )}
          </Box>

          <Box mt={2}>
            <strong className={classes.subTitle}>Notificar por SMS</strong>
            {Loading ? (
              <Skeleton variant='text' width={300} height={20} />
            ) : (
              <Typography className={classes.textTop}>
                <Chip
                  color={Cliente?.notificarSms ? 'primary' : 'default'}
                  label={Cliente?.notificarSms ? 'Si' : 'No'}
                />
              </Typography>
            )}
          </Box>

          <Box mt={2}>
            <strong className={classes.subTitle}>Notificar por Email</strong>
            {Loading ? (
              <Skeleton variant='text' width={300} height={20} />
            ) : (
              <Typography className={classes.textTop}>
                <Chip
                  color={Cliente?.notificarEmail ? 'primary' : 'default'}
                  label={Cliente?.notificarEmail ? 'Si' : 'No'}
                />
              </Typography>
            )}
          </Box>

          {me.idRol !== 'Asesor' && me.idRol !== 'RRHH' ? (
            <>
              <Box mt={2}>
                <strong className={classes.subTitle}>Autorizado Por Administrador</strong>
                {Loading ? (
                  <Skeleton variant='text' width={300} height={20} />
                ) : (
                  <Typography className={classes.textTop}>
                    {Cliente?.autorizado ? (
                      <Chip
                        avatar={
                          <Avatar
                            title={`${Cliente?.autorizado.nombres} ${Cliente?.autorizado.apellidos}`}
                            src={SourceAvatar(Cliente?.autorizado.avatar || '')}
                          />
                        }
                        label={`${Cliente?.autorizado.nombres} ${Cliente?.autorizado.apellidos}`}
                        variant='outlined'
                      />
                    ) : (
                      <Chip label='No' color='default' />
                    )}
                  </Typography>
                )}
              </Box>

              <Box mt={2}>
                <strong className={classes.subTitle}>Revisado Por Supervidor</strong>
                {Loading ? (
                  <Skeleton variant='text' width={300} height={20} />
                ) : (
                  <Typography className={classes.textTop}>
                    {Cliente?.checkSupervisor ? (
                      <Chip
                        avatar={
                          <Avatar
                            title={`${Cliente?.checkSupervisor.nombres} ${Cliente?.checkSupervisor.apellidos}`}
                            src={SourceAvatar(Cliente?.checkSupervisor.avatar || '')}
                          />
                        }
                        label={`${Cliente?.checkSupervisor.nombres} ${Cliente?.checkSupervisor.apellidos}`}
                        variant='outlined'
                      />
                    ) : (
                      <Chip label='No' color='default' />
                    )}
                  </Typography>
                )}
              </Box>

              <Box mt={2}>
                <strong className={classes.subTitle}>Revisado Por Gerente de Sucursal</strong>
                {Loading ? (
                  <Skeleton variant='text' width={300} height={20} />
                ) : (
                  <Typography className={classes.textTop}>
                    {Cliente?.checkGerenteSuc ? (
                      <Chip
                        avatar={
                          <Avatar
                            title={`${Cliente?.checkGerenteSuc.nombres} ${Cliente?.checkGerenteSuc.apellidos}`}
                            src={SourceAvatar(Cliente?.checkGerenteSuc.avatar || '')}
                          />
                        }
                        label={`${Cliente?.checkGerenteSuc.nombres} ${Cliente?.checkGerenteSuc.apellidos}`}
                        variant='outlined'
                      />
                    ) : (
                      <Chip label='No' color='default' />
                    )}
                  </Typography>
                )}
              </Box>
            </>
          ) : null}
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

          <Grid container justify='flex-start'>
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
                active={Cliente?.active}
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
              {me.idRol === 'Administrativo' && Cliente?.checkSupervisor && (
                <Button
                  disabled={
                    !Cliente?.active || !Archivos.length || Cliente?.autorizado ? true : false
                  }
                  variant='outlined'
                  title='Marcar como revisado y autorización de comisiones'
                  onClick={handleAutorizar}
                >
                  Autorizar
                </Button>
              )}

              {me.idRol === 'Supervisor' && (
                <CheckeSupervisor
                  token={token}
                  idCliente={params.idCliente}
                  isCheckSupervisor={Cliente?.checkSupervisor ? true : false}
                  clientRefNombres={`${Cliente?.nombres} ${Cliente?.apellidos}`}
                  me={me}
                  setReloadCliente={setReloadCliente}
                  disabled={!Cliente?.active || !Archivos.length}
                />
              )}

              {me.idRol === 'Asesor' && !Cliente?.checkSupervisor && (
                <NotificationSupervisor
                  token={token}
                  idCliente={params.idCliente}
                  clientRefNombres={`${Cliente?.nombres} ${Cliente?.apellidos}`}
                  me={me}
                  active={!Cliente?.active}
                />
              )}

              {me.idRol === 'Gerente de Sucursal' && (
                <CheckGerenteSuc
                  token={token}
                  active={!Cliente?.active}
                  idCliente={params.idCliente}
                  isCheckGerenteSuc={!Archivos.length || Cliente?.checkGerenteSuc ? true : false}
                  clientRefNombres={Cliente?.nombres || ''}
                  me={me}
                  clientId={Cliente?.idCliente || ''}
                  setReloadCliente={setReloadCliente}
                />
              )}

              {!Cliente?.checkDataClient && (
                <Button
                  id='notificarCLiente'
                  variant='outlined'
                  disabled={!Cliente?.active}
                  title='Revision de datos personales por parte del cliente'
                  onClick={NotificarClient}
                >
                  {LoadingNotificar ? <CircularProgress color='primary' /> : 'Notificar cliente'}
                </Button>
              )}
            </Grid>
            {!Cliente?.checkGerenteSuc &&
              (me.idRol === 'Supervisor' || me.idRol === 'Asesor') &&
              RenderEdit()}
            {(me.idRol === 'Administrativo' || me.idRol === 'Gerente de Sucursal') && RenderEdit()}

            {!Archivos.length && (
              <Grid item>
                <Button
                  id='DeleteEliminar'
                  variant='outlined'
                  disabled={!Cliente?.active || Loading}
                  onClick={() => setDialogoDelete(true)}
                  className={classes.btnEliminar}
                >
                  Eliminar
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <Page className={classes.root} title={`Detalles de ${Cliente?.nombres} ${Cliente?.apellidos}`}>
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
