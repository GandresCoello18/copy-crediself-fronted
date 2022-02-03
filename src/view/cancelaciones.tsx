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
  SvgIcon,
  TextField,
  Button,
  Avatar,
  Chip,
  Typography,
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
    dateInit: 'dd/mm/aaaa',
    dateEnd: 'dd/mm/aaaa',
  });
  const [Cancelaciones, setCancelaciones] = useState<CancelacionByDetails[]>([]);

  const fetchCancelaciones = async (page: number) => {
    setLoading(true);

    try {
      const { dateInit, dateEnd } = Filter;
      const { cancelaciones, pages } = await (
        await GetCancelaciones({ token, page, dateInit, dateEnd, find: Search })
      ).data;

      setCancelaciones(cancelaciones);
      setLoading(false);
      setCount(pages || 1);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
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
      toast.warn('No se selecciono ninguna cancelación');
    }

    setLoadingRemove(true);

    try {
      const notificacion: NewNoti = {
        sendingUser: me.idUser,
        receiptUser: SelectUser?.idUser || '',
        title: `${me.nombres.toUpperCase()} ${me.apellidos.toUpperCase()} te invita ha revisar una solicitud de cancelación.`,
        body: `Hola ${SelectUser?.nombres}, requiere ser revisado la solicitud de cancelación de un credito.`,
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
    fetchCancelaciones(1);
    FetchDirecctores();
  }, [Search]);

  useEffect(() => {
    ValidDate(true) && fetchCancelaciones(1);
  }, [Filter]);

  const SkeletonPlaceHolder = () => {
    return [0, 1, 2, 3, 4, 5, 6, 7].map(item => (
      <Skeleton key={item} style={{ marginBottom: 10 }} variant='rect' width='100%' height={40} />
    ));
  };

  const SelectItemPagination = (page: number) => console.log(page);

  const ClearFIlter = () => {
    setFilter({
      dateInit: 'dd/mm/aaaa',
      dateEnd: 'dd/mm/aaaa',
    });

    if (!Search) {
      fetchCancelaciones(1);
    }

    setSearch('');
  };

  const handleSaveAcuerdo = async () => {
    if (!IdCancelacion || !Acuerdo) {
      toast.warn('No se encontro un acuerdo redactado o una cancelación seleccionada');
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
      toast.warn('No se selecciono ninguna cancelación');
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
                        startAdornment: (
                          <InputAdornment position='start'>
                            <SvgIcon fontSize='small' color='action'>
                              <SearchIcon />
                            </SvgIcon>
                          </InputAdornment>
                        ),
                      }}
                      placeholder='Buscar por cliente'
                      variant='outlined'
                    />
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
                        defaultValue={Filter.dateEnd}
                        value={Filter.dateEnd}
                        onChange={event => setFilter({ ...Filter, dateEnd: event.target.value })}
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
                Enviar solicitud de autorización
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
        content='¿Esta seguro que deseas eliminar este registro?, una vez hecho sera irrecuperable.'
      />
    </Page>
  );
};

export default CancelacionesView;
