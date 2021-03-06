/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import {
  Box,
  Card,
  CardContent,
  Container,
  InputAdornment,
  Grid,
  makeStyles,
  TextField,
  Button,
  Avatar,
  Chip,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import Page from '../components/page';
import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toast';
import { MeContext } from '../context/contextMe';
import { AxiosError } from 'axios';
import SearchIcon from '@material-ui/icons/Search';
import { HandleError } from '../helpers/handleError';
import { Alert, Autocomplete, Pagination, Skeleton } from '@material-ui/lab';
import { DeleteCancelacion, GetCancelaciones, UpdateAcuerdoCancelacion } from '../api/cancelacion';
import { ItemCreditoCancelado } from '../components/Cancelacionn/item-credito-cancelado';
import { CancelacionByDetails } from '../interfaces/Cancelacion';
import { DialogoScreenFull } from '../components/DialogoScreenFull';
import { DialogoMessage } from '../components/DialogoMessage';
import { Usuario } from '../interfaces/Usuario';
import { GetUserByRol } from '../api/users';
import { RedaccionAcuerdo } from '../components/Cancelacionn/redaccion-acuerdo';
import { BASE_FRONTEND } from '../api';
import { NewNoti, NewNotificacion } from '../api/notificacion';
import { DialogoForm } from '../components/DialogoForm';
import { SourceAvatar } from '../helpers/sourceAvatar';
import { Sucursal } from '../interfaces/Sucursales';
import { GetSucursales } from '../api/sucursales';
import { CurrentDate } from '../helpers/fechas';

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundColor: '#f2f2f2',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  iconButton: {
    padding: 5,
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
}));

export interface FetchByDate {
  dateDesde: string;
  dateHasta: string;
}

export interface FilterCancelacion {
  dateInit: string | undefined;
  dateEnd: string;
}

export interface AcuerdoEdit {
  idCancelacion: string;
  acuerdoEdit: string;
}

const CancelacionesView = () => {
  const classes = useStyles();
  const { token, me } = useContext(MeContext);
  const [Admis, setAdmins] = useState<Usuario[]>([]);
  const [SelectUser, setSelectUser] = useState<Usuario | undefined>(undefined);
  const [Loading, setLoading] = useState<boolean>(false);
  const [DataSucursales, setDataSucursales] = useState<Sucursal[]>([]);
  const [SelectSucursal, setSelectSucursal] = useState<Sucursal | undefined>(undefined);
  const [DialogoDelete, setDialogoDelete] = useState<boolean>(false);
  const [DialogoNotifi, setDialogoNotifi] = useState<boolean>(false);
  const [LoadingRemove, setLoadingRemove] = useState<boolean>(false);
  const [AceptDialog, setAceptDialog] = useState<boolean>(false);
  const [VisibleFull, setVisibleFull] = useState<boolean>(false);
  const [Acuerdo, setAcuerdo] = useState<string>('');
  const [IdCancelacion, setIdCancelacion] = useState<string>('');
  const [Count, setCount] = useState<number>(0);
  const [Search, setSearch] = useState<string>('');
  const [AcuerdoEditado, setAcuerdoEditado] = useState<AcuerdoEdit[]>([]);
  const [Filter, setFilter] = useState<FilterCancelacion>({
    dateInit: '',
    dateEnd: '',
  });
  const [Cancelaciones, setCancelaciones] = useState<CancelacionByDetails[]>([]);

  const fetchCancelaciones = async (options: { page: number; idSucursal?: string }) => {
    const { page, idSucursal } = options;
    setLoading(true);

    try {
      const { dateInit, dateEnd } = Filter;
      const { cancelaciones, pages } = await (
        await GetCancelaciones({
          token,
          page,
          dateInit,
          dateEnd: dateEnd || CurrentDate(),
          find: Search,
          idSucursal,
        })
      ).data;

      setCancelaciones(cancelaciones);
      setLoading(false);
      setCount(pages || 1);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  const fetchSucursales = async () => {
    try {
      const { sucursales } = await (await GetSucursales({ token, empresa: me.empresa })).data;
      setDataSucursales(sucursales);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
    }
  };

  const ValidDate = (isEffect?: boolean) => {
    const { dateEnd, dateInit } = Filter;
    if (!dateEnd && !dateInit) {
      return false;
    }

    if (dateEnd === 'dd/mm/aaaa' && dateInit === 'dd/mm/aaaa') {
      return false;
    }

    if (isEffect && (dateEnd === 'dd/mm/aaaa' || dateInit === 'dd/mm/aaaa')) {
      return false;
    }

    return true;
  };

  const FetchDirecctores = async () => {
    try {
      const { usuarios } = await (await GetUserByRol({ token, name: 'Administrativo' })).data;
      setAdmins(usuarios);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
    }
  };

  const sendNotification = async () => {
    if (!IdCancelacion) {
      toast.warn('No se selecciono ninguna cancelaci??n');
    }

    setLoadingRemove(true);

    try {
      const notificacion: NewNoti = {
        sendingUser: me.idUser,
        receiptUser: SelectUser?.idUser || '',
        title: `${me.nombres.toUpperCase()} ${me.apellidos.toUpperCase()} te invita ha revisar una solicitud de cancelaci??n.`,
        body: `Hola ${SelectUser?.nombres}, requiere ser revisado la solicitud de cancelaci??n de un credito.`,
        link: `${BASE_FRONTEND}/app/cancelaciones/${IdCancelacion}`,
      };

      await NewNotificacion({ token, data: notificacion });
      setLoadingRemove(false);
      setDialogoNotifi(false);
      toast.success(`Se envio una notificacion ha: ${SelectUser?.nombres}`);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoadingRemove(false);
    }
  };

  useEffect(() => {
    fetchCancelaciones({ page: 1 });
    FetchDirecctores();
  }, []);

  useEffect(() => {
    fetchCancelaciones({ page: 1, idSucursal: SelectSucursal?.idSucursal });

    if (!DataSucursales.length) {
      fetchSucursales();
    }
  }, [Filter, DataSucursales, SelectSucursal]);

  const SkeletonPlaceHolder = () => {
    return [0, 1, 2, 3, 4, 5, 6, 7].map(item => (
      <Skeleton key={item} style={{ marginBottom: 10 }} variant='rect' width='100%' height={40} />
    ));
  };

  const SelectItemPagination = (page: number) =>
    fetchCancelaciones({ page, idSucursal: SelectSucursal?.idSucursal });

  const ClearFIlter = () => {
    setFilter({
      dateInit: 'dd/mm/aaaa',
      dateEnd: 'dd/mm/aaaa',
    });

    if (!Search) {
      fetchCancelaciones({ page: 1, idSucursal: SelectSucursal?.idSucursal });
    }

    setSearch('');
    setSelectSucursal(undefined);
  };

  const handleSaveAcuerdo = async () => {
    if (!IdCancelacion || !Acuerdo) {
      toast.warn('No se encontro un acuerdo redactado o una cancelaci??n seleccionada');
    }

    try {
      await UpdateAcuerdoCancelacion({ token, idCancelacion: IdCancelacion, acuerdo: Acuerdo });

      const edit: AcuerdoEdit = {
        idCancelacion: IdCancelacion,
        acuerdoEdit: Acuerdo,
      };

      setAcuerdoEditado([...AcuerdoEditado, ...[edit]]);
      setVisibleFull(false);
      setIdCancelacion('');
      setAcuerdo('');

      toast.success('Se agrego el acuerdo a la cancelacion de credito');
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
    }
  };

  const HandleDeleteCancelacion = async () => {
    if (!IdCancelacion) {
      toast.warn('No se selecciono ninguna cancelaci??n');
    }

    setLoadingRemove(true);

    try {
      await DeleteCancelacion({ token, idCancelacion: IdCancelacion });
      setIdCancelacion('');
      setLoadingRemove(false);
      setAceptDialog(false);
      setDialogoDelete(false);

      toast.info('Se elimino la cancelacion de credito');
    } catch (error) {
      setLoadingRemove(false);
      toast.error(HandleError(error as AxiosError));
    }
  };

  useEffect(() => {
    if (AceptDialog) {
      HandleDeleteCancelacion();
    }
  }, [AceptDialog]);

  return (
    <Page className={classes.root} title='Cancelaciones'>
      <Container maxWidth='xl'>
        <Box mt={3}>
          <Card>
            <CardContent>
              <Box alignItems='center'>
                <Grid container spacing={3} justify='space-between'>
                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      onChange={event => setSearch(event.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='start'>
                            <Button
                              color='primary'
                              variant='outlined'
                              disabled={Loading && !Cancelaciones.length}
                              onClick={() => {
                                fetchCancelaciones({
                                  page: 1,
                                  idSucursal: SelectSucursal?.idSucursal,
                                });
                              }}
                              className={classes.iconButton}
                            >
                              <SearchIcon />
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                      placeholder='Buscar por cliente'
                      variant='outlined'
                    />
                  </Grid>
                  <Grid item>
                    <FormControl className={classes.formControl}>
                      <InputLabel id='demo-simple-select-label'>Sucursales</InputLabel>
                      <Select
                        labelId='demo-simple-select-label'
                        style={{ width: 200 }}
                        disabled={Loading && !Cancelaciones.length}
                        value={SelectSucursal?.idSucursal}
                        id='id-sucursal-select'
                        onChange={event => {
                          const findSucursal = DataSucursales.find(
                            suc => suc.idSucursal === (event.target.value as string),
                          );
                          setSelectSucursal(findSucursal);
                        }}
                      >
                        <MenuItem value=''>
                          <em>Ninguna</em>
                        </MenuItem>
                        {DataSucursales.map(suc => (
                          <MenuItem key={suc.idSucursal} value={suc.idSucursal}>
                            {suc.sucursal}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <Box>
                      <TextField
                        id='Desde'
                        label='Desde'
                        type='date'
                        defaultValue={Filter.dateInit}
                        value={Filter.dateInit}
                        onChange={event => setFilter({ ...Filter, dateInit: event.target.value })}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />

                      <TextField
                        id='Hasta'
                        label='Hasta'
                        disabled={!ValidDate()}
                        type='date'
                        defaultValue={Filter.dateEnd || CurrentDate()}
                        value={Filter.dateEnd}
                        onChange={event => {
                          if (!Filter.dateInit) {
                            toast.info('Primero seleccion la fecha desde');
                            return;
                          }

                          if (
                            new Date(event.target.value).getTime() <=
                            new Date(Filter.dateInit).getTime()
                          ) {
                            toast.info('La fecha hasta tiene que ser mayor que la fecha desde');
                            return;
                          }

                          setFilter({ ...Filter, dateEnd: event.target.value });
                        }}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />

                      {ValidDate() && (
                        <Button variant='outlined' onClick={ClearFIlter}>
                          Limpiar
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box mt={3}>
          {Loading && SkeletonPlaceHolder()}
          {!Loading && !Cancelaciones.length && (
            <Alert severity='info'>
              Por el momento no hay <strong>Cancelaciones</strong> para mostrar.
            </Alert>
          )}
          {!Loading &&
            Cancelaciones.map(can => (
              <ItemCreditoCancelado
                setVisibleFull={setVisibleFull}
                setDialogoNotifi={setDialogoNotifi}
                setIdCancelacion={setIdCancelacion}
                deleteCancelacion={() => setDialogoDelete(true)}
                cancelacion={can}
                AcuerdoEditado={AcuerdoEditado}
                key={can.idCancelacion}
              />
            ))}
        </Box>
        <Box mt={3} display='flex' justifyContent='center'>
          <Pagination
            count={Count}
            color='secondary'
            onChange={(event, page) => SelectItemPagination(page)}
          />
        </Box>
      </Container>

      <DialogoScreenFull Open={VisibleFull} setOpen={setVisibleFull}>
        <RedaccionAcuerdo handleSaveAcuerdo={handleSaveAcuerdo} setAcuerdo={setAcuerdo} />
      </DialogoScreenFull>

      <DialogoForm Open={DialogoNotifi} setOpen={setDialogoNotifi} title='Selecciona un direcctor'>
        <>
          <Autocomplete
            id='combo-box-demo'
            options={Admis}
            getOptionLabel={option => option.nombres + ' ' + option.apellidos}
            getOptionSelected={(option, value) => {
              if (SelectUser === undefined) {
                setSelectUser(value);
              }
              return true;
            }}
            style={{ width: '100%' }}
            renderInput={params => (
              <TextField
                {...params}
                fullWidth
                label='Directores'
                disabled={Loading}
                variant='outlined'
                placeholder={'Seleccione el director'}
              />
            )}
          />

          <br />

          {SelectUser && (
            <>
              <Typography>
                <Chip
                  avatar={
                    <Avatar alt={SelectUser.nombres} src={SourceAvatar(SelectUser?.avatar || '')} />
                  }
                  label={SelectUser?.nombres}
                  onDelete={() => setSelectUser(undefined)}
                />
              </Typography>

              <br />

              <Button
                onClick={sendNotification}
                disabled={LoadingRemove}
                variant='outlined'
                fullWidth
              >
                Enviar solicitud de autorizaci??n
              </Button>
            </>
          )}
        </>
      </DialogoForm>

      <DialogoMessage
        title={LoadingRemove ? 'Cargando...' : 'Aviso importante'}
        Open={DialogoDelete}
        setOpen={setDialogoDelete}
        setAceptDialog={setAceptDialog}
        content='??Esta seguro que deseas eliminar este registro?, una vez hecho sera irrecuperable.'
      />
    </Page>
  );
};

export default CancelacionesView;
