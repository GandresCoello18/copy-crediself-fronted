/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import {
  Container,
  makeStyles,
  Box,
  Card,
  // Button,
  CardContent,
  InputAdornment,
  SvgIcon,
  TextField,
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

const PagosView = () => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [SearchPago, setSearchPago] = useState<string>('');
  const [PagosByCreditos, setPagosByCreditos] = useState<PagoByCredito[]>([]);
  const [Count, setCount] = useState<number>(0);
  const [Loading, setLoading] = useState<boolean>(false);
  const [ReloadPago, setReloadPago] = useState<boolean>(false);

  const fetchPagos = async (page: number) => {
    setLoading(true);

    try {
      const { pagosByCreditos, pages } = await (
        await GetPagosCreditos({ token, page, findPago: SearchPago })
      ).data;
      setPagosByCreditos(pagosByCreditos);
      setLoading(false);
      setCount(pages || 1);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagos(1);

    if (ReloadPago) {
      setReloadPago(false);
    }
  }, [ReloadPago, SearchPago]);

  const SelectItemPagination = (page: number) => fetchPagos(page);

  return (
    <Page className={classes.root} title='Pagos'>
      <Container maxWidth='xl'>
        <Box mt={3}>
          <Card>
            <CardContent>
              <Box maxWidth={500}>
                <TextField
                  fullWidth
                  onChange={event => setSearchPago(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SvgIcon fontSize='small' color='action'>
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder='Buscar Pago'
                  variant='outlined'
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box mt={3}>
          <TablaPagosByCreditos pagosByCreditos={PagosByCreditos} Loading={Loading} />
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

export default PagosView;
