/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  Grid,
  Typography,
  makeStyles,
  Box,
  Badge,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  Switch,
  MenuItem,
  Select,
  Button,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import React, { SetStateAction, Dispatch, useState, useContext } from 'react';
import { Link as RouterLink, Link } from 'react-router-dom';
import { CreditoByCliente } from '../../interfaces/Credito';
import { SourceAvatar } from '../../helpers/sourceAvatar';
import { AxiosError } from 'axios';
import { toast } from 'react-toast';
import { HandleError } from '../../helpers/handleError';
import { MeContext } from '../../context/contextMe';
import {
  NotificarAutorizarCredito,
  UpdateActiveCredito,
  UpdateAutorizarCredito,
  UpdateStatusCredito,
} from '../../api/credito';
import { ContratoCard } from './conntrato-card';
import { getPermisoExist } from '../../helpers/renderViewMainRol';

const useStyles = makeStyles(theme => ({
  headDetails: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  backGroundHeadTrue: {
    backgroundColor: theme.palette.success.main,
    color: '#000',
  },
  backGroundHeadFalse: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64,
  },
  title: theme.typography.h4,
  point: {
    cursor: 'pointer',
  },
  rowSecondary: {
    backgroundColor: '#ebebeb',
    marginBottom: 10,
  },
  marginB: {
    marginBottom: 10,
  },
  titleContrato: {
    textAlign: 'center',
    fontSize: 25,
  },
  btnDelete: {
    color: 'red',
    borderColor: 'red',
  },
  btnAutorizar: {
    color: 'green',
    borderColor: 'green',
  },
  btnApertura: {
    color: 'royalblue',
    borderColor: 'royalblue',
  },
}));

interface Props {
  credito?: CreditoByCliente;
  imgSrc: string;
  setSelectCredito: Dispatch<SetStateAction<CreditoByCliente | undefined>>;
  setVisibleApertura: Dispatch<SetStateAction<boolean>>;
}

export const DetailsCredito = ({
  credito,
  imgSrc,
  setSelectCredito,
  setVisibleApertura,
}: Props) => {
  const clases = useStyles();
  const { token, me } = useContext(MeContext);
  const [statusCredit, setStatusCredit] = useState<{ loading: boolean; modific: string }>({
    loading: false,
    modific: '',
  });
  const [Loading, setLoading] = useState<boolean>(false);
  const [LoadingSolicitud, setLoadingSolicitud] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(credito?.active ? true : false);

  const handleActive = async (check: boolean) => {
    setLoading(true);

    try {
      await UpdateActiveCredito({ token, active: check, IdCredito: credito?.idCredito || '' });
      setLoading(false);
      setIsActive(check);
    } catch (error) {
      setLoading(false);
      toast.error(HandleError(error as AxiosError));
    }
  };

  const NotificarAutorizacion = async () => {
    setLoadingSolicitud(true);

    try {
      if (me.idRol === 'Gerente de Sucursal') {
        await NotificarAutorizarCredito({
          token,
          IdCredito: credito?.idCredito || '',
        });
        toast.success('Se envio la notificación al director');
      }
      setLoadingSolicitud(false);
    } catch (error) {
      setLoadingSolicitud(false);
      toast.error(HandleError(error as AxiosError));
    }
  };

  const HandleAutorizacion = async (options: { autorizado: boolean }) => {
    setLoadingSolicitud(true);

    try {
      if (getPermisoExist({ RolName: me.idRol, permiso: 'AutorizarCredito' })) {
        const idNotification = new URLSearchParams(location.search).get('idNotificacion') as string;

        await UpdateAutorizarCredito({
          token,
          autorizar: options.autorizado,
          idNotification,
          IdCredito: credito?.idCredito || '',
        });
        toast.success('Se envio la notificación al gerente de sucursal');
      }
      setLoadingSolicitud(false);
    } catch (error) {
      setLoadingSolicitud(false);
      toast.error(HandleError(error as AxiosError));
    }
  };

  const handleStatus = async (status: string) => {
    setStatusCredit({
      ...statusCredit,
      loading: true,
    });

    try {
      await UpdateStatusCredito({ token, status, IdCredito: credito?.idCredito || '' });
      setStatusCredit({
        ...statusCredit,
        modific: status,
        loading: false,
      });
    } catch (error) {
      setStatusCredit({
        ...statusCredit,
        loading: false,
      });
      toast.error(HandleError(error as AxiosError));
    }
  };

  return (
    <Box mb={5}>
      {credito ? (
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            className={`${clases.headDetails} ${
              credito.autorizado && credito.active
                ? clases.backGroundHeadTrue
                : clases.backGroundHeadFalse
            }`}
          >
            <Box display='flex' justifyContent='space-between'>
              <Typography className={clases.title}>Credito #{credito?.numeroCredito}</Typography>
              <Badge className={clases.point} onClick={() => setSelectCredito(undefined)}>
                <VisibilityOffIcon />
              </Badge>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box alignItems='center' display='flex' flexDirection='column' p={2}>
              <Avatar
                className={clases.avatar}
                component={RouterLink}
                src={SourceAvatar('')}
                to={`/app/creditos/cliente/${credito.idCliente}`}
              />
              <Typography color='textPrimary' variant='h5'>
                {credito.cliente.nombres + ' ' + credito.cliente.apellidos}
              </Typography>
              <Typography color='textSecondary' variant='body2'>
                {credito.cliente.email}
              </Typography>
            </Box>
            <Divider />

            <Box p={2}>
              <Grid
                className={`${clases.marginB} ${
                  credito.autorizado && credito.active
                    ? clases.backGroundHeadTrue
                    : clases.backGroundHeadFalse
                }`}
                alignItems='center'
                container
                spacing={3}
                justify='space-between'
              >
                <Grid item>
                  <strong>Tipo de credito:</strong>
                </Grid>
                <Grid item>{credito.tipo}</Grid>
              </Grid>

              <Grid
                className={clases.rowSecondary}
                container
                spacing={3}
                alignItems='center'
                justify='space-between'
              >
                <Grid item>
                  <strong>Monto:</strong>
                </Grid>
                <Grid item>${credito.monto}</Grid>
              </Grid>

              <Grid
                className={`${clases.marginB} ${
                  credito.autorizado && credito.active
                    ? clases.backGroundHeadTrue
                    : clases.backGroundHeadFalse
                }`}
                container
                spacing={3}
                alignItems='center'
                justify='space-between'
              >
                <Grid item>
                  <strong>Inscripción:</strong>
                </Grid>
                <Grid item>${credito.inscripcion}</Grid>
              </Grid>

              <Grid
                className={clases.rowSecondary}
                container
                spacing={3}
                alignItems='center'
                justify='space-between'
              >
                <Grid item>
                  <strong>Iva:</strong>
                </Grid>
                <Grid item>${credito.iva}</Grid>
              </Grid>

              <Grid
                className={`${clases.marginB} ${
                  credito.autorizado && credito.active
                    ? clases.backGroundHeadTrue
                    : clases.backGroundHeadFalse
                }`}
                container
                spacing={3}
                alignItems='center'
                justify='space-between'
              >
                <Grid item>
                  <strong>Cuota:</strong>
                </Grid>
                <Grid item>${credito.cuota}</Grid>
              </Grid>

              <Grid
                className={clases.rowSecondary}
                container
                spacing={3}
                alignItems='center'
                justify='space-between'
              >
                <Grid item>
                  <strong>Total:</strong>
                </Grid>
                <Grid item>${credito.total}</Grid>
              </Grid>

              <Grid
                className={`${clases.marginB} ${
                  credito.autorizado && credito.active
                    ? clases.backGroundHeadTrue
                    : clases.backGroundHeadFalse
                }`}
                container
                spacing={3}
                alignItems='center'
                justify='space-between'
              >
                <Grid item>
                  <strong>Sucursal:</strong>
                </Grid>
                <Grid item>{credito.idSucursal}</Grid>
              </Grid>

              <Grid className={clases.rowSecondary} container spacing={3} justify='space-between'>
                <Grid item>
                  <strong>Bono de apertura:</strong>
                </Grid>
                <Grid item>
                  <Chip color='secondary' label={credito.apertura ? 'Si' : 'No'} />
                </Grid>
              </Grid>

              <Grid
                className={`${clases.marginB} ${
                  credito.autorizado && credito.active
                    ? clases.backGroundHeadTrue
                    : clases.backGroundHeadFalse
                }`}
                container
                alignItems='center'
                spacing={3}
                justify='space-between'
              >
                <Grid item>
                  <strong>Referencia:</strong>
                </Grid>
                <Grid item>{credito.referencia}</Grid>
              </Grid>

              <Grid
                className={clases.rowSecondary}
                alignItems='center'
                container
                spacing={3}
                justify='space-between'
              >
                <Grid item>
                  <strong>Autorizado:</strong>
                </Grid>
                <Grid item>
                  <Chip color='secondary' label={credito.autorizado ? 'Si' : 'No'} />
                </Grid>
              </Grid>

              <Grid
                className={`${clases.marginB} ${
                  credito.autorizado && credito.active
                    ? clases.backGroundHeadTrue
                    : clases.backGroundHeadFalse
                }`}
                container
                spacing={3}
                alignItems='center'
                justify='space-between'
              >
                <Grid item>
                  <strong>Credito numero:</strong>
                </Grid>
                <Grid item>#{credito.numeroCredito}</Grid>
              </Grid>

              <Grid
                className={clases.rowSecondary}
                container
                spacing={3}
                justify='space-between'
                alignItems='center'
              >
                <Grid item>
                  <strong>Activo:</strong>
                </Grid>
                <Grid item>
                  {Loading ? (
                    <CircularProgress color='secondary' />
                  ) : (
                    <Switch
                      checked={isActive || credito?.active ? true : false}
                      disabled={me.idRol !== 'Gerente de Sucursal'}
                      onChange={value => handleActive(value.target.checked)}
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  )}
                </Grid>
              </Grid>

              <Grid
                className={`${clases.marginB} ${
                  credito.autorizado && credito.active
                    ? clases.backGroundHeadTrue
                    : clases.backGroundHeadFalse
                }`}
                container
                alignItems='center'
                spacing={3}
                justify='space-between'
              >
                <Grid item>
                  <strong>Estado:</strong> ({statusCredit.modific || credito.estado})
                </Grid>
                <Grid item>
                  {statusCredit.loading ? (
                    <CircularProgress color='secondary' />
                  ) : (
                    <Select
                      disabled={me.idRol !== 'Gerente de Sucursal'}
                      style={{ width: 150 }}
                      onChange={event => handleStatus(event.target.value as string)}
                    >
                      <MenuItem value='Pendiente'>Pendiente</MenuItem>
                      <MenuItem value='Al dia'>Al dia</MenuItem>
                      <MenuItem value='Completado'>Completado</MenuItem>
                      <MenuItem value='Atrasado'>Atrasado</MenuItem>
                    </Select>
                  )}
                </Grid>
              </Grid>

              <Grid
                className={clases.rowSecondary}
                alignItems='center'
                container
                spacing={3}
                justify='space-between'
              >
                <Grid item>
                  <strong>Creado el:</strong>
                </Grid>
                <Grid item>{credito.created_at}</Grid>
              </Grid>

              <Grid alignItems='center' container spacing={3} justify='space-between'>
                <Grid item xs={12} className={clases.titleContrato}>
                  <strong>Contratos</strong>
                </Grid>
                <Grid item xs={12}>
                  {credito.contratos.map(contrato => (
                    <>
                      <ContratoCard contrato={contrato} />
                      <br />
                      <br />
                    </>
                  ))}
                </Grid>
              </Grid>
            </Box>
            <Box mt={1}>
              <Grid container justify='space-between'>
                {me.idRol === 'Gerente de Sucursal' ? (
                  <>
                    <Grid item xs={12} md={5}>
                      <Button
                        disabled={credito?.autorizado ? true : false}
                        className={clases.btnAutorizar}
                        onClick={NotificarAutorizacion}
                        fullWidth
                        variant='outlined'
                      >
                        {LoadingSolicitud ? (
                          <CircularProgress color='secondary' />
                        ) : credito.autorizado ? (
                          'Autorizado'
                        ) : (
                          'Solicitar Autorización'
                        )}
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Button
                        disabled={credito?.apertura ? true : false}
                        className={clases.btnApertura}
                        onClick={() => setVisibleApertura(true)}
                        fullWidth
                        variant='outlined'
                      >
                        Pago de apertura
                      </Button>
                    </Grid>
                  </>
                ) : (
                  ''
                )}

                {me.idRol === 'Administrativo' ? (
                  <Grid item xs={12} md={5}>
                    <Link to={`/app/pagos/credito/${credito.idCredito}`}>
                      <Button className={clases.btnAutorizar} fullWidth variant='outlined'>
                        Ver Pagos
                      </Button>
                    </Link>
                  </Grid>
                ) : (
                  ''
                )}

                {getPermisoExist({ RolName: me.idRol, permiso: 'AutorizarCredito' }) &&
                !credito?.autorizado ? (
                  <Grid item xs={12} md={5}>
                    <Button
                      disabled={LoadingSolicitud}
                      className={clases.btnAutorizar}
                      onClick={() => HandleAutorizacion({ autorizado: true })}
                      fullWidth
                      variant='outlined'
                    >
                      Autorizar Credito
                    </Button>
                  </Grid>
                ) : (
                  ''
                )}

                {getPermisoExist({ RolName: me.idRol, permiso: 'AutorizarCredito' }) &&
                !credito?.autorizado ? (
                  <Grid item xs={12} md={5}>
                    <Link to={`/app/creditos/cliente/${credito.idCliente}`}>
                      <Button
                        className={clases.btnDelete}
                        onClick={() => HandleAutorizacion({ autorizado: false })}
                        fullWidth
                        disabled={LoadingSolicitud}
                        variant='outlined'
                      >
                        Rechazar Credito
                      </Button>
                    </Link>
                  </Grid>
                ) : (
                  ''
                )}

                {getPermisoExist({ RolName: me.idRol, permiso: 'AutorizarCredito' }) &&
                credito?.autorizado ? (
                  <Grid item xs={12}>
                    <Alert color='info'>Credito Autorizado</Alert>
                  </Grid>
                ) : (
                  ''
                )}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <>
          <img src={imgSrc} alt='no data' width='100%' />
          <Alert severity='info'>Seleccione un credito!</Alert>
        </>
      )}
    </Box>
  );
};
