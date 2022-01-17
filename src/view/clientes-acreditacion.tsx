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
  SvgIcon,
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
}));

const ClientesAcreditacionView = () => {
  const classes = useStyles();
  const [Ids, setIds] = useState<string[]>([]);
  const { token, me } = useContext(MeContext);
  const [SearchCliente, setSearchCliente] = useState<string>('');
  const [Clientes, setClientes] = useState<Acreditacion[]>([]);
  const [Count, setCount] = useState<number>(0);
  const [Loading, setLoading] = useState<boolean>(false);
  const [LoadingIds, setLoadingIds] = useState<boolean>(false);
  const [ReloadCliente, setReloadCliente] = useState<boolean>(false);

  const fetchClientes = async (page: number) => {
    setLoading(true);

    try {
      const { clientes, pages } = await (
        await GetAcreditacionClientes({ token, page, findCliente: SearchCliente })
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
    fetchClientes(1);

    if (ReloadCliente) {
      setReloadCliente(false);
    }
  }, [ReloadCliente, SearchCliente]);

  const SelectItemPagination = (page: number) => fetchClientes(page);

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
                <Grid item xs={12} md={8}>
                  <Box maxWidth={500}>
                    <TextField
                      fullWidth
                      onChange={event => setSearchCliente(event.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <SvgIcon fontSize='small' color='action'>
                              <SearchIcon />
                            </SvgIcon>
                          </InputAdornment>
                        ),
                      }}
                      placeholder='Buscar Cliente'
                      variant='outlined'
                    />
                  </Box>
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
