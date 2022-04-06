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
import { TablaCredito } from '../components/Creditos/table-credito';
import { CreditoByCliente } from '../interfaces/Credito';
import { useParams } from 'react-router';
import { GetCreditosByUser } from '../api/credito';
import { DetailsCredito } from '../components/Creditos/details-credito';
import { DialogoForm } from '../components/DialogoForm';
import { FormNewPago } from '../components/pagos/new-pago';
import { FetchByDate } from './mis-comision';
import { CurrentDate } from '../helpers/fechas';
import { GraficoLineTemplate } from '../components/pagos/credito/grafico-line-template';
import { SourceAvatar } from '../helpers/sourceAvatar';
import { Usuario } from '../interfaces/Usuario';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#f2f2f2',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
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
  btnDelete: {
    backgroundColor: theme.palette.error.main,
  },
  containerDetails: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
}));

const CreditosByUserView = () => {
  const params = useParams();
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [User, setUser] = useState<Usuario | undefined>(undefined);
  const [SearchCredito, setSearchCliente] = useState<string>('');
  const [Statistics, setStatistics] = useState<{ value: number; created_at: string }[]>([]);
  const [Creditos, setCreditos] = useState<CreditoByCliente[]>([]);
  const [SelectCredito, setSelectCredito] = useState<CreditoByCliente | undefined>(undefined);
  const [Count, setCount] = useState<number>(0);
  const [Sucursal, setSucursal] = useState<string>('');
  const [dateFetch, setDateFetch] = useState<FetchByDate>({
    dateDesde: '',
    dateHasta: '',
  });
  const [Loading, setLoading] = useState<boolean>(false);
  const [Expanded, setExpanded] = useState<boolean>(false);
  const [VisibleApertura, setVisibleApertura] = useState<boolean>(false);
  const [ReloadCredito, setReloadCredito] = useState<boolean>(false);

  const fetchCreditosByUser = async (options: { page: number; ClearDate?: boolean }) => {
    const { page, ClearDate } = options;
    setLoading(true);

    try {
      const { creditos, pages, statistics, user, sucursal } = await (
        await GetCreditosByUser({
          token,
          page,
          idUser: params.idUser as string,
          findCredito: SearchCredito,
          dateDesde: ClearDate ? '' : dateFetch.dateDesde,
          dateHasta: dateFetch.dateHasta || CurrentDate(),
        })
      ).data;
      setCreditos(creditos);
      setLoading(false);
      setCount(pages || 1);
      setStatistics(statistics);
      setUser(user);
      setSucursal(sucursal);

      if (creditos && creditos.length === 1) {
        setSelectCredito(creditos[0]);

        if (creditos[0]?.isProcessCancelacion) {
          toast.warn('Este credito esta en proceso de cancelación');
        }
      }
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    params.idUser && fetchCreditosByUser({ page: 1 });
    setSelectCredito(undefined);

    if (ReloadCredito) {
      setReloadCredito(false);
    }
  }, [ReloadCredito, params]);

  const SelectItemPagination = (page: number) => fetchCreditosByUser({ page });

  const HandleResetFilterClient = () => {
    setSearchCliente('');
    fetchCreditosByUser({ page: 1, ClearDate: true });
  };

  return (
    <Page className={classes.root} title={`Creditos de ${User?.nombres} ${User?.apellidos}`}>
      <Container maxWidth='xl'>
        <Grid container spacing={3} justify='space-between'>
          <Grid item>
            <h2>
              Sucursal: <strong>{Loading && !Creditos.length ? '...' : Sucursal}</strong>
            </h2>
          </Grid>
          <Grid item>
            {Loading && !Creditos.length ? (
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
                    fullWidth
                    disabled={Loading && !Creditos.length}
                    onChange={event => setSearchCliente(event.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='start'>
                          <Button
                            color='primary'
                            variant='outlined'
                            disabled={Loading && !Creditos.length}
                            onClick={() => {
                              if (!SearchCredito && !dateFetch.dateDesde) {
                                toast.info('Escribe algo o selecciona fecha para buscar');
                              } else {
                                fetchCreditosByUser({ page: 1 });
                              }
                            }}
                            className={classes.iconButton}
                          >
                            <SearchIcon />
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                    placeholder='Buscar Credito por Referencia, monto y cliente'
                    variant='outlined'
                  />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                  <Box display='flex' justifyContent='space-between'>
                    <TextField
                      id='date1'
                      label='Desde'
                      type='date'
                      // defaultValue={CurrentDate(SubDate({ days: 7 }))}
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
                      // defaultValue={CurrentDate()}
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
          <Grid item xs={12}>
            <Box mt={3} mb={3}>
              <Accordion square expanded={Expanded} onChange={() => setExpanded(!Expanded)}>
                <AccordionSummary aria-controls='panel1d-content' id='panel1d-header'>
                  <Typography>Estadisticas registro de creditos</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <GraficoLineTemplate
                    label='Registros de creditos'
                    height={250}
                    data={Statistics.map(st => st.value)}
                    labels={Statistics.map(st => st.created_at)}
                  />
                </AccordionDetails>
              </Accordion>
            </Box>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <TablaCredito
                creditos={Creditos}
                Loading={Loading}
                setReloadCredito={setReloadCredito}
                setSelectCredito={setSelectCredito}
              />
            </Grid>
            <Grid item xs={12} lg={4} className={classes.containerDetails}>
              <DetailsCredito
                imgSrc='../../../no-data.svg'
                credito={SelectCredito}
                setSelectCredito={setSelectCredito}
                setVisibleApertura={setVisibleApertura}
              />
            </Grid>
          </Grid>
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

      <DialogoForm Open={VisibleApertura} setOpen={setVisibleApertura} title=''>
        <FormNewPago
          setReloadPago={setReloadCredito}
          setVisible={setVisibleApertura}
          idCredito={`${SelectCredito?.idCredito}`}
          cliente={`${SelectCredito?.cliente.nombres} ${SelectCredito?.cliente.apellidos}`}
          apertura
        />
      </DialogoForm>
    </Page>
  );
};

export default CreditosByUserView;
