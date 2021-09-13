/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import {
  Container,
  makeStyles,
  Box,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  SvgIcon,
  TextField,
} from '@material-ui/core';
import Page from '../components/page';
import { useState, useEffect, useContext } from 'react';
import { MeContext } from '../context/contextMe';
import Pagination from '@material-ui/lab/Pagination';
import SearchIcon from '@material-ui/icons/Search';
import { toast } from 'react-toast';
import { useNavigate, useParams } from 'react-router';
import { AxiosError } from 'axios';
import { HandleError } from '../helpers/handleError';
import { TablaCredito } from '../components/Creditos/table-credito';
import { CreditoByCliente } from '../interfaces/Credito';
import { GetCreditosCliente } from '../api/credito';
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

const CreditoClienteOnlyView = () => {
  const params = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const { token } = useContext(MeContext);
  const [SearchCredito, setSearchCliente] = useState<string>('');
  const [Creditos, setCreditos] = useState<CreditoByCliente[]>([]);
  const [SelectCredito, setSelectCredito] = useState<CreditoByCliente | undefined>(undefined);
  const [Loading, setLoading] = useState<boolean>(false);
  const [VisibleApertura, setVisibleApertura] = useState<boolean>(false);
  const [Count, setCount] = useState<number>(0);
  const [ReloadCredito, setReloadCredito] = useState<boolean>(false);

  const fetchCreditos = async (page: number) => {
    setLoading(true);

    try {
      const { creditos, pages } = await (
        await GetCreditosCliente({
          token,
          idCliente: params.idCliente,
          page,
          findCredito: SearchCredito,
        })
      ).data;

      if (creditos === undefined) {
        navigate('/app/creditos');
      }

      setCreditos(creditos);
      setCount(pages || 1);
      setLoading(false);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    params.idCliente && fetchCreditos(1);
    setSelectCredito(undefined);

    if (ReloadCredito) {
      setReloadCredito(false);
    }
  }, [params, ReloadCredito]);

  const SelectItemPagination = (page: number) => fetchCreditos(page);

  return (
    <Page className={classes.root} title='Detalles de Credito'>
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

export default CreditoClienteOnlyView;
