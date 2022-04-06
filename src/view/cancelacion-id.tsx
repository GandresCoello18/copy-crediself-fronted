/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { Avatar, Box, Button, Container, Grid, makeStyles, TextField } from '@material-ui/core';
import Page from '../components/page';
import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toast';
import { MeContext } from '../context/contextMe';
import { AxiosError } from 'axios';
import { HandleError } from '../helpers/handleError';
import { Alert, Skeleton } from '@material-ui/lab';
import { GetCancelacion, UpdateAutorizacionCancelacion } from '../api/cancelacion';
import { CancelacionByDetails } from '../interfaces/Cancelacion';
import { useNavigate, useParams } from 'react-router';
import { ContratoCard } from '../components/Creditos/conntrato-card';
import { SourceAvatar } from '../helpers/sourceAvatar';
import { RenderContentItemCancelacion } from '../components/Cancelacionn/item-credito-cancelado';
import { RenderMainViewRol } from '../helpers/renderViewMainRol';
import { CurrentDate, AddDate } from '../helpers/fechas';

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundColor: '#f2f2f2',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  headContante: {
    backgroundColor: theme.palette.success.main,
    color: '#696969',
  },
  btnAutorization: {
    color: 'orange',
    border: 1,
    borderStyle: 'solid',
    borderColor: 'orange',
  },
  avatar: {
    height: 40,
    width: 40,
  },
}));

const CancelacionView = () => {
  const params = useParams();
  const navigate = useNavigate();
  const classes = useStyles();
  const { token, me } = useContext(MeContext);
  const [fechaHaPagar, setFechaHaPagar] = useState<string>('');
  const [Loading, setLoading] = useState<boolean>(false);
  const [LoadingAuht, setLoadingAuht] = useState<boolean>(false);
  const [Cancelacion, setCancelacion] = useState<CancelacionByDetails | undefined>(undefined);

  const fetchCancelacion = async () => {
    setLoading(true);

    try {
      const { cancelacion } = await (
        await GetCancelacion({ token, idCancelacion: params.idCancelacion as string })
      ).data;

      if (cancelacion === undefined) {
        navigate(RenderMainViewRol(me.idRol));
      }

      setCancelacion(cancelacion);
      setFechaHaPagar(cancelacion?.fechaHaPagar || CurrentDate(AddDate({ days: 20 })));
      setLoading(false);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  const HandleAutorizacion = async () => {
    setLoadingAuht(true);

    if (!fechaHaPagar) {
      toast.warn('Seleccione la fecha ha pagar las devoluciones');
      return;
    }

    if (new Date().getTime() >= new Date(fechaHaPagar).getTime()) {
      toast.warn('La fecha ha pagar tiene que ser mayor a la actual');
      return;
    }

    try {
      await UpdateAutorizacionCancelacion({
        token,
        idCancelacion: params.idCancelacion as string,
        autorizacion: Cancelacion?.autorizado ? false : true,
        fechaHaPagar,
      });
      setLoadingAuht(false);
      toast.success('Se envio una notificación ha cobranza');
      fetchCancelacion();
    } catch (error) {
      setLoadingAuht(false);
      toast.error(HandleError(error as AxiosError));
    }
  };

  const SkeletonPlaceHolder = () => (
    <Grid container spacing={2} justify='space-between'>
      <Grid item xs={12} md={3} lg={4}>
        <Skeleton style={{ marginBottom: 10 }} variant='rect' width='100%' height={340} />
      </Grid>
      <Grid item xs={12} md={3} lg={4}>
        <Skeleton style={{ marginBottom: 10 }} variant='rect' width='100%' height={340} />
      </Grid>
      <Grid item xs={12} md={3} lg={4}>
        <Skeleton style={{ marginBottom: 10 }} variant='rect' width='100%' height={340} />
      </Grid>
    </Grid>
  );

  useEffect(() => {
    params.idCancelacion && fetchCancelacion();
  }, [params]);

  return (
    <Page className={classes.root} title='Detalle de cancelación'>
      <Container maxWidth='xl'>
        {Cancelacion && me.idRol === 'Administrativo' ? (
          <Box display='flex' justifyContent='flex-end'>
            <Button
              className={classes.btnAutorization}
              disabled={Cancelacion.credito.estado === 'Cancelado' || LoadingAuht}
              onClick={HandleAutorizacion}
            >
              {Cancelacion.autorizado ? 'Quitar autorización' : 'Autorizar'}
            </Button>

            <TextField
              id='date1'
              label='Fecha ha pagar las devoluciones'
              type='date'
              style={{ marginLeft: 20, minWidth: 240, maxWidth: 280 }}
              disabled={
                Cancelacion.credito.estado === 'Cancelado' ||
                Cancelacion.autorizado === 1 ||
                LoadingAuht
              }
              defaultValue={fechaHaPagar || CurrentDate(AddDate({ days: 20 }))}
              onChange={event => setFechaHaPagar(event.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        ) : null}
        <Box mt={3}>
          {Loading && SkeletonPlaceHolder()}

          {!Loading && !Cancelacion && (
            <Alert severity='info'>
              Por el momento no hay <strong>Cancelaciones</strong> para mostrar.
            </Alert>
          )}

          {!Loading && Cancelacion ? (
            <Grid spacing={3} container justify='center'>
              <Grid item xs={12} md={4}>
                <Box p={2} className={classes.headContante}>
                  <h4>Información de cancelación</h4>
                </Box>
                {RenderContentItemCancelacion({
                  field: 'Creado el',
                  value: Cancelacion.created_at as string,
                })}
                {RenderContentItemCancelacion({
                  field: 'Autorizado',
                  value: Cancelacion.acuerdo ? 'SI' : 'NO',
                })}
                {RenderContentItemCancelacion({
                  field: 'Acuerdo',
                  value: Cancelacion.acuerdo || '(NONE)',
                })}
                {RenderContentItemCancelacion({
                  field: 'Total a pagar',
                  value: `$${Cancelacion.retornoPago}` || '(NONE)',
                })}
                {RenderContentItemCancelacion({
                  field: 'Fecha Pago',
                  value: (Cancelacion.fechaHaPagar as string) || '(NONE)',
                })}
              </Grid>
              <Grid item xs={12} md={4}>
                <Box p={2} className={classes.headContante}>
                  <h4>Información del cliente</h4>
                </Box>
                {RenderContentItemCancelacion({
                  field: 'Nombres',
                  value: Cancelacion.cliente.nombres,
                })}
                {RenderContentItemCancelacion({
                  field: 'Apellidos',
                  value: Cancelacion.cliente.apellidos,
                })}
                {RenderContentItemCancelacion({
                  field: 'Email',
                  value: Cancelacion.cliente.email || '(NONE)',
                })}
                {RenderContentItemCancelacion({
                  field: 'Telefono',
                  value: Cancelacion.cliente.telefono || '(NONE)',
                })}
                {RenderContentItemCancelacion({
                  field: 'Ciudad',
                  value: Cancelacion.cliente.ciudad || '(NONE)',
                })}
                {RenderContentItemCancelacion({ field: 'Sexo', value: Cancelacion.cliente.sexo })}
              </Grid>
              <Grid item xs={12} md={4}>
                <Box p={2} className={classes.headContante}>
                  <h4>Información del credito</h4>
                </Box>
                {RenderContentItemCancelacion({ field: 'Tipo', value: Cancelacion.credito.tipo })}
                {RenderContentItemCancelacion({
                  field: 'Monto',
                  value: `$${Cancelacion.credito.monto}`,
                })}
                {RenderContentItemCancelacion({
                  field: 'Estado',
                  value: Cancelacion.credito.estado,
                })}
                {RenderContentItemCancelacion({
                  field: 'Numero',
                  value: `#${Cancelacion.credito.numeroCredito}`,
                })}
                <Box borderTop={1} borderColor='success.main' p={2}>
                  <Grid spacing={3} container justify='space-between'>
                    <Grid item>Cancelación solicitada por:</Grid>
                    <Grid item>
                      <Box display='flex' alignItems='center' flexDirection='row'>
                        <span>
                          {Cancelacion.user.nombres} {Cancelacion.user.apellidos}
                        </span>
                        &nbsp; &nbsp;
                        <Avatar
                          className={classes.avatar}
                          src={SourceAvatar(Cancelacion.user.avatar)}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                {RenderContentItemCancelacion({ field: 'Rol', value: Cancelacion.user.idRol })}
              </Grid>
              <Grid item xs={12} md={4}>
                <Box p={2} className={classes.headContante}>
                  <h4>Información de contratos</h4>
                </Box>

                {Cancelacion.contratos.map(contrato => (
                  <ContratoCard key={contrato.id_credito_contrato} contrato={contrato} />
                ))}
              </Grid>
            </Grid>
          ) : null}
        </Box>
      </Container>
    </Page>
  );
};

export default CancelacionView;
