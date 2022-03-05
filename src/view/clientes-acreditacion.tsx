/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import {
  Container,
  makeStyles,
  Box,
  Card,
  Grid,
  CardContent,
  InputAdornment,
  TextField,
  Button,
} from '@material-ui/core';
import Page from '../components/page';
import { useState, useEffect, useContext } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { MeContext } from '../context/contextMe';
import Pagination from '@material-ui/lab/Pagination';
import { toast } from 'react-toast';
import { AxiosError } from 'axios';
import { HandleError } from '../helpers/handleError';
import { GetAcreditacionClientes } from '../api/clientes';
import { Acreditacion } from '../interfaces/Cliente';
import { TablaClienteAcreditacion } from '../components/Acreditacion/table-acreditacion';
import { AcreditarCredito } from '../api/credito';
import { FetchByDate } from './mis-comision';
import { CurrentDate } from '../helpers/fechas';

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundColor: '#f2f2f2',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  iconButton: {
    padding: 5,
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
  btnDelete: {
    backgroundColor: theme.palette.error.main,
  },
}));

const ClientesAcreditacionView = () => {
  const classes = useStyles();
  const [Ids, setIds] = useState<string[]>([]);
  const { token, me } = useContext(MeContext);
  const [SearchCliente, setSearchCliente] = useState<string>('');
  const [Clientes, setClientes] = useState<Acreditacion[]>([]);
  const [dateFetch, setDateFetch] = useState<FetchByDate>({
    dateDesde: '',
    dateHasta: '',
  });
  const [Count, setCount] = useState<number>(0);
  const [Loading, setLoading] = useState<boolean>(false);
  const [LoadingIds, setLoadingIds] = useState<boolean>(false);
  const [ReloadCliente, setReloadCliente] = useState<boolean>(false);

  const fetchClientes = async (options: { page: number; clearDate?: boolean }) => {
    const { page, clearDate } = options;
    setLoading(true);

    try {
      const { clientes, pages } = await (
        await GetAcreditacionClientes({
          token,
          page,
          findCliente: SearchCliente,
          dateDesde: clearDate ? '' : dateFetch.dateDesde,
          dateHasta: dateFetch.dateHasta || CurrentDate(),
        })
      ).data;
      setClientes(clientes);
      setLoading(false);
      setCount(pages || 1);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes({ page: 1 });

    if (ReloadCliente) {
      setReloadCliente(false);
    }
  }, [ReloadCliente, SearchCliente]);

  const SelectItemPagination = (page: number) => fetchClientes({ page });

  const handleAcreditar = async () => {
    setLoadingIds(true);

    try {
      await AcreditarCredito({ token, idsCreditos: Ids });
      setLoadingIds(false);
      setReloadCliente(true);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoadingIds(false);
    }
  };

  const HandleResetFilterCliente = () => {
    setSearchCliente('');
    setDateFetch({ dateDesde: '', dateHasta: '' });
    fetchClientes({ page: 1, clearDate: true });
  };

  return (
    <Page className={classes.root} title='Acreditacion de clientes'>
      <Container maxWidth='xl'>
        <Box mt={3}>
          <Card>
            <CardContent>
              <Grid
                container
                spacing={3}
                direction='row'
                justify='space-between'
                alignItems='center'
              >
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    onChange={event => setSearchCliente(event.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='start'>
                          <Button
                            color='primary'
                            variant='outlined'
                            disabled={Loading && !Clientes.length}
                            onClick={() => {
                              if (!SearchCliente && !dateFetch.dateDesde) {
                                toast.info('Escribe algo o selecciona fecha para buscar');
                              } else {
                                fetchClientes({ page: 1 });
                              }
                            }}
                            className={classes.iconButton}
                          >
                            <SearchIcon />
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                    placeholder='Buscar Cliente'
                    variant='outlined'
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                  <Box display='flex' justifyContent='space-between'>
                    <TextField
                      id='date1'
                      label='Desde'
                      type='date'
                      onChange={event =>
                        setDateFetch({ ...dateFetch, dateDesde: event.target.value })
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />

                    <TextField
                      id='date2'
                      label='Hasta'
                      style={{ marginLeft: 20 }}
                      type='date'
                      onChange={event => {
                        if (!dateFetch.dateDesde) {
                          toast.error('Selecciona primero la fecha de DESDE');
                          return;
                        }

                        if (
                          new Date(dateFetch.dateDesde).getTime() >
                          new Date(event.target.value).getTime()
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
                </Grid>
                <Grid item xs={12} md={2} lg={1}>
                  <Button color='secondary' variant='outlined' onClick={HandleResetFilterCliente}>
                    Restablecer
                  </Button>
                </Grid>
                <Grid item>
                  {Ids.length ? (
                    <Button
                      onClick={handleAcreditar}
                      size='small'
                      disabled={LoadingIds}
                      title='Acreditar los clientes seleccionados'
                      variant='outlined'
                    >
                      {!LoadingIds ? (
                        <span>
                          Acreditar &nbsp; <strong>{Ids.length}</strong> &nbsp; creditos
                        </span>
                      ) : (
                        'Acreditando...'
                      )}
                    </Button>
                  ) : null}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
        <Box mt={3}>
          <TablaClienteAcreditacion
            setIds={setIds}
            Ids={Ids}
            me={me}
            clientes={Clientes}
            Loading={Loading}
          />
        </Box>
        <Box mt={3} display='flex' justifyContent='center'>
          <Pagination
            count={Count}
            color='secondary'
            onChange={(event, page) => SelectItemPagination(page)}
          />
        </Box>
      </Container>
    </Page>
  );
};

export default ClientesAcreditacionView;
