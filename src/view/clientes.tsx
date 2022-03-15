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
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Grid,
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
import { DialogoForm } from '../components/DialogoForm';
import { GetClientes } from '../api/clientes';
import { TablaCliente } from '../components/cliente/table-cliente';
import { Cliente } from '../interfaces/Cliente';
import { FormNewCliente } from '../components/cliente/new-cliente';
import { getPermisoExist } from '../helpers/renderViewMainRol';
import { Sucursal } from '../interfaces/Sucursales';
import { GetSucursales } from '../api/sucursales';
import { FetchByDate } from './mis-comision';
import { CurrentDate } from '../helpers/fechas';
import { GraficoLineTemplate } from '../components/pagos/credito/grafico-line-template';

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

const ClientesView = () => {
  const classes = useStyles();
  const { token, me } = useContext(MeContext);
  const [Expanded, setExpanded] = useState<boolean>(false);
  const [SearchCliente, setSearchCliente] = useState<string>('');
  const [Clientes, setClientes] = useState<Cliente[]>([]);
  const [Count, setCount] = useState<number>(0);
  const [dateFetch, setDateFetch] = useState<FetchByDate>({
    dateDesde: '',
    dateHasta: '',
  });
  const [Visible, setVisible] = useState<boolean>(false);
  const [DataSucursales, setDataSucursales] = useState<Sucursal[]>([]);
  const [SelectSucursal, setSelectSucursal] = useState<Sucursal | undefined>(undefined);
  const [Loading, setLoading] = useState<boolean>(false);
  const [Statistics, setStatistics] = useState<{ value: number; created_at: string }[]>([]);
  const [ReloadCliente, setReloadCliente] = useState<boolean>(false);

  const fetchClientes = async (options: {
    page: number;
    idSucursal?: string;
    ClearDate?: boolean;
  }) => {
    const { page, idSucursal, ClearDate } = options;
    setLoading(true);

    try {
      const { clientes, pages, statistics } = await (
        await GetClientes({
          token,
          page,
          findCliente: SearchCliente,
          idSucursal,
          dateDesde: ClearDate ? '' : dateFetch.dateDesde,
          dateHasta: dateFetch.dateHasta || CurrentDate(),
        })
      ).data;
      setClientes(clientes);
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
    fetchClientes({ page: 1, idSucursal: SelectSucursal?.idSucursal });

    if (
      (me.idRol === 'Administrativo' || me.idRol === 'Gerente Regional') &&
      !DataSucursales.length
    ) {
      fetchSucursales();
    }

    if (ReloadCliente) {
      setReloadCliente(false);
    }
  }, [ReloadCliente, me, SelectSucursal]);

  const SelectItemPagination = (page: number) =>
    fetchClientes({ page, idSucursal: SelectSucursal?.idSucursal });

  const HandleResetFilterClient = () => {
    setSelectSucursal(undefined);
    setSearchCliente('');
    setDateFetch({ dateDesde: '', dateHasta: '' });
    fetchClientes({ page: 1, ClearDate: true });
  };

  return (
    <Page className={classes.root} title='Clientes'>
      <Container maxWidth='xl'>
        {getPermisoExist({ RolName: me.idRol, permiso: 'NewCliente' }) ? (
          <Box display='flex' justifyContent='flex-end'>
            <Button
              id='newClient'
              color='secondary'
              variant='contained'
              onClick={() => setVisible(true)}
            >
              Nuevo cliente
            </Button>
          </Box>
        ) : null}
        <Box mt={3}>
          <Card>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                  <TextField
                    id='inputSearchCliente'
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
                                fetchClientes({ page: 1, idSucursal: SelectSucursal?.idSucursal });
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

                {me.idRol === 'Administrativo' ||
                me.idRol === 'Gerente Regional' ||
                me.idRol === 'Gerente Regional' ? (
                  <>
                    <Grid item xs={12} md={2}>
                      <FormControl className={classes.formControl}>
                        <InputLabel id='demo-simple-select-label'>Sucursales</InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          style={{ width: '100%' }}
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
                      <Button
                        id='restablecerFilterClient'
                        color='secondary'
                        variant='outlined'
                        onClick={HandleResetFilterClient}
                      >
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
          {me.idRol === 'Administrativo' ||
          me.idRol === 'Gerente Regional' ||
          me.idRol === 'Gerente de Sucursal' ? (
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
          ) : null}
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

      {getPermisoExist({ RolName: me.idRol, permiso: 'NewCliente' }) ? (
        <DialogoForm Open={Visible} setOpen={setVisible} title=''>
          <FormNewCliente setReloadCliente={setReloadCliente} setVisible={setVisible} />
        </DialogoForm>
      ) : null}
    </Page>
  );
};

export default ClientesView;
