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
  Popover,
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
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { PagoByCredito } from '../interfaces/Pago';
import { useParams } from 'react-router';
import { DialogoForm } from '../components/DialogoForm';
import { TablaPagosByCredito } from '../components/pagos/table-pagos';
import { FormNewPago } from '../components/pagos/new-pago';
import { Cliente } from '../interfaces/Cliente';
import { CurrentDate } from '../helpers/fechas';
// import { DetailsCreditoPago } from '../components/pagos/details-credito-pago';

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
  atrasado?: number;
  datePayment?: string;
  dateRegister?: string;
}

const PagosByCreditoView = () => {
  const classes = useStyles();
  const params = useParams();
  const { token } = useContext(MeContext);
  const [Pagos, setPagos] = useState<PagoByCredito[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [SearchPagos, setSearchPagos] = useState<PagoByCredito[]>([]);
  const [Cliente, setCliente] = useState<Cliente | undefined>(undefined);
  const [Visible, setVisible] = useState<boolean>(false);
  const [Loading, setLoading] = useState<boolean>(false);
  const [Expanded, setExpanded] = useState<boolean>(false);
  const [ParamsFilter, setParamsFilter] = useState<ParamsFilterPagos>({
    typePayment: undefined,
    atrasado: undefined,
    datePayment: undefined,
    dateRegister: undefined,
  });
  const [ReloadPago, setReloadPago] = useState<boolean>(false);

  const open = Boolean(anchorEl);

  const fetchPagos = async () => {
    setLoading(true);

    try {
      const { pagos, cliente } = await (
        await GetPagosByCredito({ token, idCredito: params.idCredito })
      ).data;
      setPagos(pagos);
      setSearchPagos(pagos);
      setLoading(false);
      setCliente(cliente);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    params.idCredito && fetchPagos();

    if (ReloadPago) {
      setReloadPago(false);
    }
  }, [ReloadPago, params]);

  useEffect(() => {
    const { typePayment, atrasado, datePayment, dateRegister } = ParamsFilter;

    if (Pagos.length && (typePayment || atrasado || datePayment || dateRegister)) {
      const filterPago = Pagos.filter(pago => {
        if (
          typePayment === pago.tipo_de_pago ||
          atrasado === pago.atrasado ||
          datePayment === pago.pagado_el ||
          (dateRegister && dateRegister.indexOf(pago.created_at) !== -1)
        ) {
          return pago;
        }
      });

      setSearchPagos(filterPago);
    }
  }, [ParamsFilter, Pagos]);

  const ResetParams = () => {
    setParamsFilter({
      typePayment: undefined,
      atrasado: undefined,
      datePayment: undefined,
      dateRegister: undefined,
    });
    setSearchPagos(Pagos);
  };

  const handleClickQuestion = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Page className={classes.root} title='Pagos de credito'>
      <Container maxWidth='xl'>
        <Box display='flex' justifyContent='flex-end'>
          <Button color='secondary' variant='contained' onClick={() => setVisible(true)}>
            Registrar pago
          </Button>
        </Box>
        <Box mt={3}>
          <Card>
            <CardContent>
              <Box maxWidth={1000}>
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
                      {['Trasnferencia Bancaria', 'Deposito Bancario'].map(item => (
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
                          checked={ParamsFilter.atrasado ? true : false}
                          onChange={event =>
                            setParamsFilter({
                              ...ParamsFilter,
                              atrasado: event.target.checked ? 1 : undefined,
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
                    <Button color='secondary' variant='outlined' onClick={ResetParams}>
                      Restablecer
                    </Button>

                    <Button aria-describedby='question-params' onClick={handleClickQuestion}>
                      <HelpOutlineIcon />
                    </Button>
                    <Popover
                      id='question-params'
                      open={open}
                      anchorEl={anchorEl}
                      onClose={() => setAnchorEl(null)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                    >
                      <Typography className={classes.contentPopover}>
                        Estos parametros solo hacen parte de funcion para la siguiente tabla, si no
                        hay reacciones en la tabla quiere decir que no encuentra coincidencias. Más
                        si hay alguna reaccion, quiere decir que por lo menos un parametro si
                        coincide.
                      </Typography>
                    </Popover>
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
              <Grid container>
                <Grid item xs={12} md={6}>
                  detalles credito
                </Grid>
                <Grid item xs={12} md={6}>
                  grafico
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box mt={3}>
          <TablaPagosByCredito pagosByCreditos={SearchPagos} Loading={Loading} />
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
    </Page>
  );
};

export default PagosByCreditoView;
