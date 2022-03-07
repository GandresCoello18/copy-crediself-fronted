/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import {
  Container,
  makeStyles,
  Box,
  Card,
  Button,
  CardContent,
  InputAdornment,
  TextField,
  Grid,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Avatar,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import Page from '../components/page';
import { useState, useEffect, useContext } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { MeContext } from '../context/contextMe';
import Pagination from '@material-ui/lab/Pagination';
import { toast } from 'react-toast';
import { AxiosError } from 'axios';
import { HandleError } from '../helpers/handleError';
import { useParams } from 'react-router';
import { GetClientesByUser } from '../api/clientes';
import { TablaCliente } from '../components/cliente/table-cliente';
import { Cliente } from '../interfaces/Cliente';
import { FetchByDate } from './mis-comision';
import { CurrentDate } from '../helpers/fechas';
import { GraficoLineTemplate } from '../components/pagos/credito/grafico-line-template';
import { Usuario } from '../interfaces/Usuario';
import { SourceAvatar } from '../helpers/sourceAvatar';

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
  },
  btnDelete: {
    backgroundColor: theme.palette.error.main,
  },
}));

const ClientesByUserView = () => {
  const params = useParams();
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [Expanded, setExpanded] = useState<boolean>(false);
  const [SearchCliente, setSearchCliente] = useState<string>('');
  const [Sucursal, setSucursal] = useState<string>('');
  const [Clientes, setClientes] = useState<Cliente[]>([]);
  const [User, setUser] = useState<Usuario | undefined>(undefined);
  const [Count, setCount] = useState<number>(0);
  const [dateFetch, setDateFetch] = useState<FetchByDate>({
    dateDesde: '',
    dateHasta: '',
  });
  const [Loading, setLoading] = useState<boolean>(false);
  const [Statistics, setStatistics] = useState<{ value: number; created_at: string }[]>([]);
  const [ReloadCliente, setReloadCliente] = useState<boolean>(false);

  const fetchClientes = async (options: { page: number; ClearDate?: boolean }) => {
    const { page, ClearDate } = options;
    setLoading(true);

    try {
      const { clientes, pages, statistics, user, sucursal } = await (
        await GetClientesByUser({
          token,
          page,
          findCliente: SearchCliente,
          dateDesde: ClearDate ? '' : dateFetch.dateDesde,
          dateHasta: dateFetch.dateHasta || CurrentDate(),
          idUser: params.idUser,
        })
      ).data;
      setClientes(clientes);
      setLoading(false);
      setCount(pages || 1);
      setStatistics(statistics);
      setUser(user);
      setSucursal(sucursal);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    params.idUser && fetchClientes({ page: 1 });

    if (ReloadCliente) {
      setReloadCliente(false);
    }
  }, [ReloadCliente, params]);

  const SelectItemPagination = (page: number) => fetchClientes({ page });

  const HandleResetFilterClient = () => {
    setSearchCliente('');
    setDateFetch({ dateDesde: '', dateHasta: '' });
    fetchClientes({ page: 1, ClearDate: true });
  };

  return (
    <Page className={classes.root} title={`Clientes de ${User?.nombres} ${User?.apellidos}`}>
      <Container maxWidth='xl'>
        <Grid container spacing={3} justify='space-between'>
          <Grid item>
            <h2>
              Sucursal: <strong>{Loading && !Clientes.length ? '...' : Sucursal}</strong>
            </h2>
          </Grid>
          <Grid item>
            {Loading && !Clientes.length ? (
              <CircularProgress />
            ) : (
              <Card title={User?.nombres + ' ' + User?.apellidos}>
                <CardHeader
                  avatar={
                    <Avatar
                      src={SourceAvatar(User?.avatar || '')}
                      alt={User?.nombres}
                      aria-label='recipe'
                    />
                  }
                  title={User?.nombres + ' ' + User?.apellidos}
                  subheader={User?.email}
                />
              </Card>
            )}
          </Grid>
        </Grid>
        <Box mt={3}>
          <Card>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                  <TextField
                    disabled={Loading && !Clientes.length}
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
                                toast.info('Escribe algo o selecciona fechas para buscar');
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
                  <Button color='secondary' variant='outlined' onClick={HandleResetFilterClient}>
                    Restablecer
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
        <Box mt={3}>
          <Accordion square expanded={Expanded} onChange={() => setExpanded(!Expanded)}>
            <AccordionSummary aria-controls='panel1d-content' id='panel1d-header'>
              <Typography>Estadisticas registro de clientes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <GraficoLineTemplate
                label='Registros de clientes'
                height={250}
                data={Statistics.map(st => st.value)}
                labels={Statistics.map(st => st.created_at)}
              />
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box mt={3}>
          <TablaCliente clientes={Clientes} Loading={Loading} setReloadCliente={setReloadCliente} />
        </Box>
        <Box mt={3} display='flex' justifyContent='center'>
          <Pagination
            disabled={Loading}
            count={Count}
            color='secondary'
            onChange={(event, page) => SelectItemPagination(page)}
          />
        </Box>
      </Container>
    </Page>
  );
};

export default ClientesByUserView;
