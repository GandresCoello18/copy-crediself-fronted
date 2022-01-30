/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { Container, makeStyles, Box, Grid, TextField } from '@material-ui/core';
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
import { GetComisionesByUser, GetComisionesByUserAll } from '../api/comisiones';
import { MisComisiones, StaticComision } from '../interfaces/Comision';
import { CurrentDate, SubDate } from '../helpers/fechas';
import { TableCoomision } from '../components/Comisiones/table-comision';
import { Pagination } from '@material-ui/lab';

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundColor: '#f2f2f2',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

export interface FetchByDate {
  dateDesde: string;
  dateHasta: string;
}

const Panel = () => {
  const classes = useStyles();
  const { token, me } = useContext(MeContext);
  const [Count, setCount] = useState<number>(0);
  const [dateFetch, setDateFetch] = useState<FetchByDate>({
    dateDesde: '',
    dateHasta: '',
  });
  const [Loading, setLoading] = useState<boolean>(false);
  const [Statistics, setStatistics] = useState<StaticComision | undefined>(undefined);
  const [Comisiones, setComisiones] = useState<MisComisiones[]>([]);

  const Fetch = async (page?: number) => {
    setLoading(true);
    const { dateDesde, dateHasta } = dateFetch;

    try {
      if (me.idRol === 'Administrativo') {
        const { comisiones, statistics, pages } = await (
          await GetComisionesByUserAll({
            token,
            dateDesde: dateDesde || CurrentDate(SubDate({ days: 7 })),
            dateHasta: dateHasta || CurrentDate(),
            page: page || 1,
          })
        ).data;

        setCount(pages || 0);
        setComisiones(comisiones);
        setStatistics(statistics);
      } else {
        const { comisiones, statistics } = await (
          await GetComisionesByUser({
            token,
            dateDesde: dateDesde || CurrentDate(SubDate({ days: 7 })),
            dateHasta: dateHasta || CurrentDate(),
          })
        ).data;

        setComisiones(comisiones);
        setStatistics(statistics);
      }
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
    dateFetch.dateDesde && dateFetch.dateHasta && Fetch();
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

  const SelectItemPagination = (page: number) => Fetch(page);

  return (
    <Page className={classes.root} title='Mis Comisiones'>
      <Container maxWidth='xl'>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalProfit Loading={Loading} Amount={Statistics?.Amount || 0} />
          </Grid>
          {me.idRol === 'Asesor' || me.idRol === 'Supervisor' ? (
            <>
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
            </>
          ) : null}
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Box display='flex' justifyContent='space-between'>
              <div />

              <div>
                <TextField
                  id='date1'
                  label='Desde'
                  type='date'
                  defaultValue={CurrentDate(SubDate({ days: 7 }))}
                  onChange={event => setDateFetch({ ...dateFetch, dateDesde: event.target.value })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  id='date2'
                  label='Hasta'
                  style={{ marginLeft: 20 }}
                  type='date'
                  defaultValue={CurrentDate()}
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
              </div>
            </Box>
          </Grid>
          {me.idRol === 'Asesor' || me.idRol === 'Supervisor' ? (
            <Grid item xs={12}>
              <Sales
                fechas={Statistics?.grafico.labels}
                ventas={Statistics?.grafico.data}
                comision={Statistics?.grafico.data2}
                Loading={Loading}
              />
            </Grid>
          ) : null}
          <Grid item xs={12}>
            {!Comisiones.length && !Loading ? (
              <Alert severity='info'>
                No tienes comisiones del periodo desded:{' '}
                <strong>{dateFetch.dateDesde || CurrentDate(SubDate({ days: 7 }))}</strong> hasta{' '}
                <strong>{dateFetch.dateHasta || CurrentDate()}</strong>
              </Alert>
            ) : null}
            <br />

            <Box mt={3}>
              <TableCoomision comision={Comisiones} Loading={Loading} />
            </Box>

            {Count ? (
              <Box mt={3} display='flex' justifyContent='center'>
                <Pagination
                  count={Count}
                  color='secondary'
                  onChange={(event, page) => SelectItemPagination(page)}
                />
              </Box>
            ) : null}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Panel;
