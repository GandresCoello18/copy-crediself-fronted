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
import { GetCreditos } from '../api/credito';
import { DetailsCredito } from '../components/Creditos/details-credito';
import { DialogoForm } from '../components/DialogoForm';
import { FormNewPago } from '../components/pagos/new-pago';

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
  containerDetails: { backgroundColor: '#fff', borderTopLeftRadius: 10, borderTopRightRadius: 10 },
}));

const CreditosView = () => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [SearchCredito, setSearchCliente] = useState<string>('');
  const [Creditos, setCreditos] = useState<CreditoByCliente[]>([]);
  const [SelectCredito, setSelectCredito] = useState<CreditoByCliente | undefined>(undefined);
  const [Count, setCount] = useState<number>(0);
  const [Loading, setLoading] = useState<boolean>(false);
  const [VisibleApertura, setVisibleApertura] = useState<boolean>(false);
  const [ReloadCredito, setReloadCredito] = useState<boolean>(false);

  const fetchCreditos = async (page: number) => {
    setLoading(true);

    try {
      const { creditos, pages } = await (
        await GetCreditos({ token, page, findCredito: SearchCredito })
      ).data;
      setCreditos(creditos);
      setLoading(false);
      setCount(pages || 1);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditos(1);
    setSelectCredito(undefined);

    if (ReloadCredito) {
      setReloadCredito(false);
    }
  }, [ReloadCredito, SearchCredito]);

  const SelectItemPagination = (page: number) => fetchCreditos(page);

  return (
    <Page className={classes.root} title='Clientes'>
      <Container maxWidth='xl'>
        <Box mt={3}>
          <Card>
            <CardContent>
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
                  placeholder='Buscar Credito por Referencia y monto'
                  variant='outlined'
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box mt={3}>
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
                imgSrc='../no-data.svg'
                credito={SelectCredito}
                setSelectCredito={setSelectCredito}
                setVisibleApertura={setVisibleApertura}
              />
            </Grid>
          </Grid>
        </Box>
        <Box mt={3} display='flex' justifyContent='center'>
          <Pagination
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

export default CreditosView;
