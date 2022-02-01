/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  Grid,
  Typography,
  makeStyles,
  Box,
  Badge,
  Popover,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  Switch,
  MenuItem,
  Select,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  GenerarCompraVentaCredito,
  GenerarPaqueteBienvenida,
  NotificarAutorizarCredito,
  UpdateActiveCredito,
  UpdateAutorizarCredito,
  UpdateStatusCredito,
} from '../../api/credito';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ContratoCard } from './conntrato-card';
import { getPermisoExist } from '../../helpers/renderViewMainRol';
import { NewCancelacion } from '../../api/cancelacion';

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
    marginBottom: 5,
  },
  backGroundHeadFalse: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    marginBottom: 5,
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
    marginBottom: 5,
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
  btnPaquete: {
    color: '#5794f0',
    borderColor: '#5794f0',
  },
  btnApertura: {
    color: 'royalblue',
    borderColor: 'royalblue',
  },
  btnCancelar: {
    color: 'red',
    borderColor: 'red',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  textPopover: {
    padding: theme.spacing(2),
  },
}));

interface Props {
  credito?: CreditoByCliente;
  imgSrc: string;
  setReloadCredito?: Dispatch<SetStateAction<boolean>>;
  setSelectCredito: Dispatch<SetStateAction<CreditoByCliente | undefined>>;
  setVisibleApertura: Dispatch<SetStateAction<boolean>>;
}

export const DetailsCredito = ({
  credito,
  imgSrc,
  setReloadCredito,
  setSelectCredito,
  setVisibleApertura,
}: Props) => {
  const clases = useStyles();
  const [isPopover, setIsPopover] = useState<string | null>(null);
  const { token, me } = useContext(MeContext);
  const [Expanded, setExpanded] = useState<string>('');
  const [statusCredit, setStatusCredit] = useState<{ loading: boolean; modific: string }>({
    loading: false,
    modific: '',
  });
  const [Loading, setLoading] = useState<boolean>(false);
  const [LoadingPackage, setLoadingPackage] = useState<boolean>(false);
  const [LoadingSolicitud, setLoadingSolicitud] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(credito?.active ? true : false);

  const handleChangeAcordion = (panel: string) => (event: any, isExpanded: any) => {
    setExpanded(isExpanded ? panel : '');
  };

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

  const HandlePackageWelcome = async () => {
    setLoadingPackage(true);

    try {
      await GenerarPaqueteBienvenida({ token, idCredito: credito?.idCredito || '' });

      if (setReloadCredito) {
        setTimeout(() => {
          setReloadCredito(true);
          setLoadingPackage(false);
          setIsPopover(null);
        }, 10000);
      }

      setIsPopover('btn-generate-paquete');
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoadingPackage(false);
    }
  };

  const HandleCompraVentaCredito = async () => {
    setLoadingPackage(true);

    try {
      await GenerarCompraVentaCredito({ token, idCredito: credito?.idCredito || '' });
      setLoadingPackage(false);
      setReloadCredito && setReloadCredito(true);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoadingPackage(false);
    }
  };

  const HandleCancelacion = async () => {
    try {
      await NewCancelacion({ token, idCredito: credito?.idCredito || '' });
      toast.info('Se envio la solicitud de cancelación');
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
    }
  };

  const RenderRowDetails = (
    field: string,
    value: string,
    active: number,
    autorizado: number,
    isSecondary?: boolean,
  ) => {
    let classNameJsx = '';

    if (autorizado && active) {
      classNameJsx = clases.backGroundHeadTrue;
    } else {
      classNameJsx = clases.backGroundHeadFalse;
    }

    if (isSecondary) {
      classNameJsx = clases.rowSecondary;
    }

    return (
      <Grid
        className={classNameJsx}
        container
        spacing={3}
        alignItems='center'
        justify='space-between'
      >
        <Grid item>
          <strong>{field}:</strong>
        </Grid>
        <Grid item>{value}</Grid>
      </Grid>
    );
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
              {RenderRowDetails(
                'Tipo de credito',
                credito.tipo,
                credito.active,
                credito.autorizado,
              )}
              {RenderRowDetails('Monto', `$${credito.monto}`, 0, 0, true)}
              {RenderRowDetails(
                'Inscripción',
                `$${credito.inscripcion}`,
                credito.active,
                credito.autorizado,
              )}
              {RenderRowDetails('Iva', `$${credito.iva}`, 0, 0, true)}
              {RenderRowDetails('Cuota', `$${credito.cuota}`, credito.active, credito.autorizado)}
              {RenderRowDetails('Total', `$${credito.total}`, 0, 0, true)}
              {RenderRowDetails('Sucursal', credito.idSucursal, credito.active, credito.autorizado)}

              <Grid className={clases.rowSecondary} container spacing={3} justify='space-between'>
                <Grid item>
                  <strong>Bono de apertura:</strong>
                </Grid>
                <Grid item>
                  <Chip color='secondary' label={credito.apertura ? 'Si' : 'No'} />
                </Grid>
              </Grid>

              {RenderRowDetails(
                'Referencia',
                credito.referencia,
                credito.active,
                credito.autorizado,
              )}

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

              {RenderRowDetails(
                'Credito numero',
                `#${credito.numeroCredito}`,
                credito.active,
                credito.autorizado,
              )}

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

              {RenderRowDetails('Creado el', `${credito.created_at}`, 0, 0, true)}

              <Grid alignItems='center' container spacing={3} justify='space-between'>
                <Grid item xs={12} className={clases.titleContrato}>
                  <strong>Archivos Fuentes</strong>
                </Grid>
                <Grid item xs={12}>
                  <Accordion
                    expanded={Expanded === 'contratros'}
                    onChange={handleChangeAcordion('contratros')}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls='contratros-content'
                      id='contratros-header'
                    >
                      <Typography className={clases.heading}>Contratos</Typography>
                      <Typography className={clases.secondaryHeading}>
                        Documentos del contrato
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container>
                        {credito.contratos
                          .filter(item => item.isPackageWelcome === 0)
                          .map(contrato => (
                            <Grid item xs={12} key={contrato.idContrato}>
                              <ContratoCard contrato={contrato} />
                            </Grid>
                          ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>

                <Grid item xs={12}>
                  <Accordion
                    expanded={Expanded === 'paquete-welcome'}
                    onChange={handleChangeAcordion('paquete-welcome')}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls='paquete-welcome-content'
                      id='paquete-welcome-header'
                    >
                      <Typography className={clases.heading}>Paquete de Bienvenida</Typography>
                      <Typography className={clases.secondaryHeading}>
                        Documentos del contrato
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container>
                        {credito.contratos
                          .filter(item => item.isPackageWelcome === 1)
                          .map(contrato => (
                            <Grid item xs={12} key={contrato.idContrato}>
                              <ContratoCard contrato={contrato} />
                            </Grid>
                          ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            </Box>
            <Box mt={3}>
              <Grid container spacing={3} justify='center'>
                {me.idRol === 'Gerente de Sucursal' ? (
                  <>
                    <Grid item>
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
                    <Grid item>
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
                    {credito?.estado === 'Al dia' || credito?.estado === 'Atrasado' ? (
                      <Grid item>
                        <Button
                          className={clases.btnCancelar}
                          onClick={HandleCancelacion}
                          fullWidth
                          variant='outlined'
                        >
                          Cancelar
                        </Button>
                      </Grid>
                    ) : null}
                  </>
                ) : null}

                {getPermisoExist({ RolName: me.idRol, permiso: 'AutorizarCredito' }) &&
                !credito?.autorizado ? (
                  <Grid item>
                    <Button
                      title='Se necesita el pago #13 para autorizar el credito'
                      disabled={LoadingSolicitud}
                      className={clases.btnAutorizar}
                      onClick={() => HandleAutorizacion({ autorizado: true })}
                      fullWidth
                      variant='outlined'
                    >
                      Autorizar Credito
                    </Button>
                  </Grid>
                ) : null}

                {me.idRol === 'Administrativo' &&
                credito.acreditado &&
                !credito.contratos.find(cre => cre.contrato === 'Compra-venta-vehiculo') ? (
                  <Grid item>
                    <Button
                      title='Generar contrato de compra y venta'
                      disabled={LoadingPackage}
                      className={clases.btnPaquete}
                      onClick={HandleCompraVentaCredito}
                      fullWidth
                      variant='outlined'
                    >
                      Generar compra y venta
                    </Button>
                  </Grid>
                ) : null}

                {me.idRol === 'Administrativo' ? (
                  <>
                    <Grid item>
                      <Link to={`/app/pagos/credito/${credito.idCredito}`}>
                        <Button
                          disabled={credito?.apertura === 0}
                          className={clases.btnAutorizar}
                          fullWidth
                          variant='outlined'
                        >
                          Ver Pagos
                        </Button>
                      </Link>
                    </Grid>

                    {credito.contratos.filter(
                      item =>
                        item.isPackageWelcome && item.id_credito_contrato === 'id_generado_app',
                    ).length === 0 ? (
                      <Grid item>
                        <Button
                          aria-describedby='btn-generate-paquete'
                          className={clases.btnPaquete}
                          disabled={
                            LoadingPackage ||
                            credito.contratos.filter(
                              item =>
                                item.isPackageWelcome &&
                                item.id_credito_contrato !== 'id_generado_app',
                            ).length > 0
                          }
                          onClick={HandlePackageWelcome}
                          fullWidth
                          variant='outlined'
                        >
                          Generar Paquete de bienvenida
                        </Button>
                        <Popover
                          id='btn-generate-paquete'
                          open={isPopover ? true : false}
                          onClose={() => setIsPopover(null)}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                          }}
                        >
                          <Typography className={clases.textPopover}>
                            Generando archivos 📁, se actualizara la vista en 10 segundos 🕗.
                          </Typography>
                        </Popover>
                      </Grid>
                    ) : null}
                  </>
                ) : null}

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
                ) : null}

                {getPermisoExist({ RolName: me.idRol, permiso: 'AutorizarCredito' }) &&
                credito?.autorizado ? (
                  <Grid item xs={12}>
                    <Alert color='info'>Credito Autorizado</Alert>
                  </Grid>
                ) : null}
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
