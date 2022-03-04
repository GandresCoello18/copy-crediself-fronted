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
    minWidth: 120,
  },
  btnDelete: {
    backgroundColor: theme.palette.error.main,
  },
}));

const ClientesView = () => {
  const classes = useStyles();
  const { token, me } = useContext(MeContext);
  const [SearchCliente, setSearchCliente] = useState<string>('');
  const [Clientes, setClientes] = useState<Cliente[]>([]);
  const [Count, setCount] = useState<number>(0);
  const [Visible, setVisible] = useState<boolean>(false);
  const [DataSucursales, setDataSucursales] = useState<Sucursal[]>([]);
  const [SelectSucursal, setSelectSucursal] = useState<Sucursal | undefined>(undefined);
  const [Loading, setLoading] = useState<boolean>(false);
  const [ReloadCliente, setReloadCliente] = useState<boolean>(false);

  const fetchClientes = async (options: { page: number; idSucursal?: string }) => {
    const { page, idSucursal } = options;
    setLoading(true);

    try {
      const { clientes, pages } = await (
        await GetClientes({ token, page, findCliente: SearchCliente, idSucursal })
      ).data;
      setClientes(clientes);
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
    fetchClientes({ page: 1, idSucursal: SelectSucursal?.idSucursal });

    if (me.idRol === 'Administrativo' && !DataSucursales.length) {
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
    fetchClientes({ page: 1 });
  };

  return (
    <Page className={classes.root} title='Clientes'>
      <Container maxWidth='xl'>
        {getPermisoExist({ RolName: me.idRol, permiso: 'NewCliente' }) ? (
          <Box display='flex' justifyContent='flex-end'>
            <Button color='secondary' variant='contained' onClick={() => setVisible(true)}>
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
                              if (SearchCliente) {
                                fetchClientes({ page: 1, idSucursal: SelectSucursal?.idSucursal });
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
                    placeholder='Buscar Cliente'
                    variant='outlined'
                  />
                </Grid>

                {me.idRol === 'Administrativo' ? (
                  <>
                    <Grid item xs={12} md={3} lg={2}>
                      <FormControl className={classes.formControl}>
                        <InputLabel id='demo-simple-select-label'>Sucursales</InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          style={{ width: 200 }}
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

      <DialogoForm Open={Visible} setOpen={setVisible} title=''>
        <FormNewCliente setReloadCliente={setReloadCliente} setVisible={setVisible} />
      </DialogoForm>
    </Page>
  );
};

export default ClientesView;
