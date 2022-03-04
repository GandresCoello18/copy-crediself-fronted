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
  const [PagosByCreditos, setPagosByCreditos] = useState<PagoByCredito[]>([]);
  const [DataSucursales, setDataSucursales] = useState<Sucursal[]>([]);
  const [SelectSucursal, setSelectSucursal] = useState<Sucursal | undefined>(undefined);
  const [Count, setCount] = useState<number>(0);
  const [Loading, setLoading] = useState<boolean>(false);
  const [ReloadPago, setReloadPago] = useState<boolean>(false);

  const fetchPagos = async (options: { page: number; idSucursal?: string }) => {
    const { page, idSucursal } = options;
    setLoading(true);

    try {
      const { pagosByCreditos, pages } = await (
        await GetPagosCreditos({ token, page, findPago: SearchPago, idSucursal })
      ).data;
      setPagosByCreditos(pagosByCreditos);
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

  const HandleResetFilterClient = () => {
    setSelectSucursal(undefined);
    setSearchPago('');
    fetchPagos({ page: 1 });
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
                                if (SearchPago) {
                                  fetchPagos({ page: 1, idSucursal: SelectSucursal?.idSucursal });
                                } else {
                                  toast.info('Escribe algo para buscar');
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

                {me.idRol === 'Administrativo' ? (
                  <>
                    <Grid item xs={12} md={3} lg={2}>
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

                    <Grid item xs={12} md={1}>
                      <Button
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
