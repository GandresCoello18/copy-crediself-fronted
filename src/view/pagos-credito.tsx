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
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import Page from '../components/page';
import { useState, useEffect, useContext } from 'react';
import { MeContext } from '../context/contextMe';
import { toast } from 'react-toast';
import { AxiosError } from 'axios';
import { HandleError } from '../helpers/handleError';
import { GetPagosByCredito } from '../api/pagos';
import { Pago } from '../interfaces/Pago';
import { useParams } from 'react-router';
import { DialogoForm } from '../components/DialogoForm';
import { FormNewPago } from '../components/pagos/new-pago';
import { Cliente } from '../interfaces/Cliente';
import { CurrentDate } from '../helpers/fechas';
import Pagination from '@material-ui/lab/Pagination';
import { TablaPagosByCredito } from '../components/pagos/credito/table-pagos-by-credito';
import { Credito } from '../interfaces/Credito';
import { DetailsCreditoPago } from '../components/pagos/details-credito-pago';
import { Doughnut } from 'react-chartjs-2';
import { GraficoPaymentCredito } from '../components/pagos/credito/grafico-pagos-credito';
import { DialogoScreenFull } from '../components/DialogoScreenFull';
import { ReciboPagoView } from '../components/pagos/credito/recibo-pago';
import { getPermisoExist } from '../helpers/renderViewMainRol';

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundColor: '#f2f2f2',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  btnDelete: {
    backgroundColor: theme.palette.error.main,
  },
  contentPopover: {
    padding: 10,
  },
}));

export interface ParamsFilterPagos {
  typePayment?: string;
  isAtrasado?: number;
  datePayment?: string;
  dateRegister?: string;
  dateCorrespondiente?: string;
}

const PagosByCreditoView = () => {
  const classes = useStyles();
  const params = useParams();
  const [Count, setCount] = useState<number>(0);
  const { token, me } = useContext(MeContext);
  const [Pagos, setPagos] = useState<Pago[]>([]);
  const [Cliente, setCliente] = useState<Cliente | undefined>(undefined);
  const [Credito, setCredito] = useState<Credito | undefined>(undefined);
  const [Statistics, setStatistics] = useState<{ total: number; atrasado: number }[]>([]);
  const [StatisticsValue, setStatisticsValue] = useState<
    { valor: number; mes_correspondiente: string }[]
  >([]);
  const [VisibleFullScreen, setVisibleFullScreen] = useState<boolean>(false);
  const [Visible, setVisible] = useState<boolean>(false);
  const [Loading, setLoading] = useState<boolean>(false);
  const [Expanded, setExpanded] = useState<boolean>(false);
  const [ParamsFilter, setParamsFilter] = useState<ParamsFilterPagos>({
    typePayment: undefined,
    isAtrasado: 0,
    datePayment: undefined,
    dateRegister: undefined,
    dateCorrespondiente: undefined,
  });
  const [ReloadPago, setReloadPago] = useState<boolean>(false);

  const fetchPagos = async (page: number) => {
    setLoading(true);

    try {
      const { pagos, cliente, credito, statistics, statisticsValue, pages } = await (
        await GetPagosByCredito({ token, idCredito: params.idCredito, page, ParamsFilter })
      ).data;
      setPagos(pagos);
      setCredito(credito);
      setCount(pages || 1);
      setCliente(cliente);
      setStatistics(statistics);
      setStatisticsValue(statisticsValue);
      setLoading(false);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    params.idCredito && fetchPagos(1);

    if (ReloadPago) {
      setReloadPago(false);
    }
  }, [ReloadPago, params]);

  useEffect(() => {
    fetchPagos(1);
  }, [ParamsFilter]);

  const ResetParams = () => {
    setParamsFilter({
      typePayment: undefined,
      isAtrasado: 0,
      datePayment: undefined,
      dateRegister: undefined,
    });
    fetchPagos(1);
  };

  const SelectItemPagination = (page: number) => fetchPagos(page);

  return (
    <Page className={classes.root} title='Pagos de credito'>
      <Container maxWidth='xl'>
        <Box display='flex' justifyContent='space-between'>
          <Button color='secondary' variant='contained' onClick={() => setVisibleFullScreen(true)}>
            Recibo
          </Button>
          {getPermisoExist({ permiso: 'NewPayment', RolName: me.idRol }) && (
            <Button color='secondary' variant='contained' onClick={() => setVisible(true)}>
              Registrar pago
            </Button>
          )}
        </Box>
        <Box mt={3}>
          <Card>
            <CardContent>
              <Box maxWidth={1300}>
                <Grid
                  container
                  spacing={3}
                  direction='row'
                  justify='space-between'
                  alignItems='center'
                >
                  <Grid item>
                    <InputLabel id='demo-simple-select-outlined-label'>Tipo de pago</InputLabel>
                    <Select
                      labelId='demo-simple-select-outlined-label'
                      id='demo-simple-select-outlined'
                      style={{ width: '100%' }}
                      onChange={event =>
                        setParamsFilter({
                          ...ParamsFilter,
                          typePayment: event.target.value as string,
                        })
                      }
                      label='Tipo de pago'
                    >
                      {['Tarjeta', 'Terminal Bancario'].map(item => (
                        <MenuItem value={item} key={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={ParamsFilter.isAtrasado ? true : false}
                          onChange={event =>
                            setParamsFilter({
                              ...ParamsFilter,
                              isAtrasado: event.target.checked ? 1 : 0,
                            })
                          }
                        />
                      }
                      label='Atrasado'
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      fullWidth
                      type='date'
                      label='Fecha de pago'
                      variant='outlined'
                      onChange={event =>
                        setParamsFilter({ ...ParamsFilter, datePayment: event.target.value })
                      }
                      defaultValue={CurrentDate()}
                      placeholder={'Seleccione su fecha de pago'}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      fullWidth
                      type='date'
                      label='Fecha registrado'
                      variant='outlined'
                      onChange={event =>
                        setParamsFilter({ ...ParamsFilter, dateRegister: event.target.value })
                      }
                      defaultValue={CurrentDate()}
                      placeholder={'Seleccione su fecha de registro'}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      id='date'
                      label='Mes correspondiente'
                      type='month'
                      value={ParamsFilter.dateCorrespondiente}
                      onChange={event =>
                        setParamsFilter({
                          ...ParamsFilter,
                          dateCorrespondiente: event.target.value,
                        })
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Button color='secondary' variant='outlined' onClick={ResetParams}>
                      Restablecer
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box mt={3}>
          <Accordion square expanded={Expanded} onChange={() => setExpanded(!Expanded)}>
            <AccordionSummary aria-controls='panel1d-content' id='panel1d-header'>
              <Typography>Credito y Estadisticas</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container justify='space-between'>
                <Grid item xs={12} md={5}>
                  {Credito && Cliente && <DetailsCreditoPago credito={Credito} cliente={Cliente} />}
                </Grid>
                <Grid item xs={12} md={6}>
                  <GraficoPaymentCredito
                    data={StatisticsValue.map(item => item.valor)}
                    labels={StatisticsValue.map(item => item.mes_correspondiente)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Doughnut
                    data={{
                      datasets: [
                        {
                          backgroundColor: ['#fec4d2', '#696969'],
                          data: [
                            Statistics.find(item => item.atrasado)?.total,
                            Statistics.find(item => !item.atrasado)?.total,
                          ],
                          label: 'Pagos del credito',
                        },
                      ],
                      labels: ['Pagos Atrasado', 'Pagos No Atrasado'],
                    }}
                    width={100}
                    options={{ maintainAspectRatio: false }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box mt={3}>
          <TablaPagosByCredito
            cliente={Cliente}
            credito={Credito}
            pagos={Pagos}
            Loading={Loading}
            setReloadPago={setReloadPago}
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

      <DialogoForm Open={Visible} setOpen={setVisible} title=''>
        <FormNewPago
          setVisible={setVisible}
          setReloadPago={setReloadPago}
          idCredito={params.idCredito}
          cliente={`${Cliente?.nombres.toUpperCase()} ${Cliente?.apellidos.toUpperCase()}`}
        />
      </DialogoForm>

      <DialogoScreenFull Open={VisibleFullScreen} setOpen={setVisibleFullScreen}>
        <ReciboPagoView />
      </DialogoScreenFull>
    </Page>
  );
};

export default PagosByCreditoView;
