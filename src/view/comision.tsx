/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { Container, makeStyles, Grid } from '@material-ui/core';
import Page from '../components/page';
import Budget from '../components/Panel/Budget';
import Sales from '../components/Panel/Sales';
import TasksProgress from '../components/Panel/TasksProgress';
import Alert from '@material-ui/lab/Alert';
import TotalCustomers from '../components/Panel/TotalCustomers';
import TotalProfit from '../components/Panel/TotalProfit';
import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toast';
import { MeContext } from '../context/contextMe';
import { AxiosError } from 'axios';
import { HandleError } from '../helpers/handleError';
import { GetComisionesByUser } from '../api/comisiones';
import { MisComisiones, StaticComision } from '../interfaces/Comision';
import { CurrentDate, GetMonth } from '../helpers/fechas';

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundColor: '#f2f2f2',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const Panel = () => {
  const classes = useStyles();
  const { token, me } = useContext(MeContext);
  const [dateFetch, setDateFetch] = useState<string>(CurrentDate(true) || '');
  const [Loading, setLoading] = useState<boolean>(false);
  const [Statistics, setStatistics] = useState<StaticComision | undefined>(undefined);
  const [Comisiones, setComisiones] = useState<MisComisiones[]>([]);

  const Fetch = async () => {
    setLoading(true);

    try {
      const { comisiones, statistics } = await (
        await GetComisionesByUser({ token, mes: dateFetch || CurrentDate(true) })
      ).data;

      setComisiones(comisiones);
      setStatistics(statistics);
      setLoading(false);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    token && Fetch();
  }, [token]);

  useEffect(() => {
    dateFetch && Fetch();
  }, [dateFetch]);

  const renderTitleProgress = () => {
    if (me.idRol === 'Supervisor') {
      return 'Todos tus asesores deben ser productivos para completar la barra';
    }

    if (me.idRol === 'Asesor') {
      return 'Completar 5 ventas en el mes';
    }

    return '';
  };

  return (
    <Page className={classes.root} title='Comisiones'>
      <Container maxWidth='lg'>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Budget
              ventasMes={Statistics?.ventas.countMonth || 0}
              totalVentas={Statistics?.ventas.count || 0}
              lasTotalVentas={Statistics?.ventas.countLastMonth || 0}
              Loading={Loading}
            />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalCustomers
              user={Statistics?.clientes.countMonth || 0}
              totalUser={Statistics?.clientes.count || 0}
              lasTotalUser={Statistics?.clientes.countLastMonth || 0}
              Loading={Loading}
            />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12} title={renderTitleProgress()}>
            <TasksProgress progress={Statistics?.task.progress || 0} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalProfit Loading={Loading} Amount={Statistics?.Amount} />
          </Grid>
          <Grid item xs={12}>
            <Sales
              fechas={Statistics?.grafico.labels}
              ventas={Statistics?.grafico.data}
              comision={Statistics?.grafico.data2}
              setDateFetch={setDateFetch}
              Loading={Loading}
            />
          </Grid>
          {!Comisiones.length && !Loading ? (
            <Grid item xs={12}>
              <Alert severity='info'>
                No tienes comisiones del mes:{' '}
                <strong>{dateFetch || GetMonth(CurrentDate())}</strong>
              </Alert>
            </Grid>
          ) : null}
        </Grid>
      </Container>
    </Page>
  );
};

export default Panel;
