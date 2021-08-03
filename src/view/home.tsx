/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { Container, makeStyles, Grid } from '@material-ui/core';
import Page from '../components/page';
import Budget from '../components/Panel/Budget';
import Sales from '../components/Panel/Sales';
import TasksProgress from '../components/Panel/TasksProgress';
import TotalCustomers from '../components/Panel/TotalCustomers';
import TotalProfit from '../components/Panel/TotalProfit';
import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toast';
import { MeContext } from '../context/contextMe';

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundColor: '#f2f2f2',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

export const Panel = () => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [dateFetch, setDateFetch] = useState<string>('');
  const [Loading, setLoading] = useState<boolean>(false);

  const Fetch = async () => {
    setLoading(true);

    try {
      setLoading(false);
    } catch (error) {
      if (error.request.response) {
        toast.error(JSON.parse(error.request.response).status);
      } else {
        toast.error(error.message);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    token && Fetch();
  }, [token]);

  useEffect(() => {
    dateFetch && Fetch();
  }, [dateFetch]);

  return (
    <Page className={classes.root} title='Panel'>
      <Container maxWidth='lg'>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Budget order={0} totalOrders={0} lasTotalOrders={0} Loading={Loading} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalCustomers user={0} totalUser={0} lasTotalUser={0} Loading={Loading} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TasksProgress progress={0} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalProfit Loading={Loading} Amount={0} ComisionAmount={0} />
          </Grid>
          <Grid item xs={12}>
            <Sales
              fechas={[]}
              ventas={[]}
              comision={[]}
              setDateFetch={setDateFetch}
              Loading={Loading}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};
