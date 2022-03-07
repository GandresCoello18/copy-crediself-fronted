/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import {
  Container,
  makeStyles,
  Box,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';
import Page from '../components/page';
import { useState, useEffect, useContext } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { MeContext } from '../context/contextMe';
import Pagination from '@material-ui/lab/Pagination';
import { toast } from 'react-toast';
import { AxiosError } from 'axios';
import { HandleError } from '../helpers/handleError';
import { GetPagosCreditos } from '../api/pagos';
import { PagoByCredito } from '../interfaces/Pago';
import { TablaPagosByCreditos } from '../components/pagos/table-pagos';
import { Sucursal } from '../interfaces/Sucursales';
import { GetSucursales } from '../api/sucursales';
import { FetchByDate } from './mis-comision';
import { CurrentDate } from '../helpers/fechas';
import { GraficoLineTemplate } from '../components/pagos/credito/grafico-line-template';

const useStyles = makeStyles(theme => ({
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
    minWidth: 120,
  },
  btnDelete: {
    backgroundColor: theme.palette.error.main,
  },
}));

const PagosView = () => {
  const classes = useStyles();
  const { token, me } = useContext(MeContext);
  const [SearchPago, setSearchPago] = useState<string>('');
  const [Statistics, setStatistics] = useState<{ value: number; created_at: string }[]>([]);
  const [Expanded, setExpanded] = useState<boolean>(false);
  const [PagosByCreditos, setPagosByCreditos] = useState<PagoByCredito[]>([]);
  const [dateFetch, setDateFetch] = useState<FetchByDate>({
    dateDesde: '',
    dateHasta: '',
  });
  const [DataSucursales, setDataSucursales] = useState<Sucursal[]>([]);
  const [SelectSucursal, setSelectSucursal] = useState<Sucursal | undefined>(undefined);
  const [Count, setCount] = useState<number>(0);
  const [Loading, setLoading] = useState<boolean>(false);
  const [ReloadPago, setReloadPago] = useState<boolean>(false);

  const fetchPagos = async (options: {
    page: number;
    idSucursal?: string;
    clearDate?: boolean;
  }) => {
    const { page, idSucursal, clearDate } = options;
    setLoading(true);

    try {
      const { pagosByCreditos, pages, statistics } = await (
        await GetPagosCreditos({
          token,
          page,
          findPago: SearchPago,
          idSucursal,
          dateDesde: clearDate ? '' : dateFetch.dateDesde,
          dateHasta: dateFetch.dateHasta || CurrentDate(),
        })
      ).data;
      setPagosByCreditos(pagosByCreditos);
      setLoading(false);
      setCount(pages || 1);

      setStatistics(statistics);
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

  useEffect(() => {
    fetchPagos({ page: 1, idSucursal: SelectSucursal?.idSucursal });

    if (me.idRol === 'Administrativo' && !DataSucursales.length) {
      fetchSucursales();
    }

    if (ReloadPago) {
      setReloadPago(false);
    }
  }, [ReloadPago, me, SelectSucursal]);

  const SelectItemPagination = (page: number) =>
    fetchPagos({ page, idSucursal: SelectSucursal?.idSucursal });

  const HandleResetFilterPago = () => {
    setSelectSucursal(undefined);
    setSearchPago('');
    setDateFetch({ dateDesde: '', dateHasta: '' });
    fetchPagos({ page: 1, clearDate: true });
  };

  return (
    <Page className={classes.root} title='Pagos'>
      <Container maxWidth='xl'>
        <Box mt={3}>
          <Card>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                  <Box display='flex'>
                    <TextField
                      fullWidth
                      disabled={Loading && !PagosByCreditos.length}
                      onChange={event => setSearchPago(event.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='start'>
                            <Button
                              color='primary'
                              variant='outlined'
                              disabled={Loading && !PagosByCreditos.length}
                              onClick={() => {
                                if (!SearchPago && !dateFetch.dateDesde) {
                                  toast.info('Escribe algo o selecciona fecha para buscar');
                                } else {
                                  fetchPagos({ page: 1, idSucursal: SelectSucursal?.idSucursal });
                                }
                              }}
                              className={classes.iconButton}
                            >
                              <SearchIcon />
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                      placeholder='Buscar Pago'
                      variant='outlined'
                    />
                  </Box>
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

                {me.idRol === 'Administrativo' ? (
                  <>
                    <Grid item xs={12} md={2}>
                      <FormControl className={classes.formControl}>
                        <InputLabel id='demo-simple-select-label'>Sucursales</InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          style={{ width: 200 }}
                          disabled={Loading && !PagosByCreditos.length}
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

                    <Grid item xs={12} md={2} lg={1}>
                      <Button color='secondary' variant='outlined' onClick={HandleResetFilterPago}>
                        Restablecer
                      </Button>
                    </Grid>
                  </>
                ) : null}
              </Grid>
            </CardContent>
          </Card>
        </Box>
        <Box mt={3}>
          {me.idRol === 'Administrativo' ? (
            <Accordion square expanded={Expanded} onChange={() => setExpanded(!Expanded)}>
              <AccordionSummary aria-controls='panel1d-content' id='panel1d-header'>
                <Typography>Estadisticas registro de pagos</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <GraficoLineTemplate
                  label='Registros de pagos'
                  height={250}
                  data={Statistics.map(st => st.value)}
                  labels={Statistics.map(st => st.created_at)}
                />
              </AccordionDetails>
            </Accordion>
          ) : null}
        </Box>
        <Box mt={3}>
          <TablaPagosByCreditos pagosByCreditos={PagosByCreditos} Loading={Loading} />
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

export default PagosView;
