/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { Container, makeStyles, Box, CircularProgress } from '@material-ui/core';
import Page from '../components/page';
import { useContext, useEffect, useState } from 'react';
import { MeContext } from '../context/contextMe';
import Calendar from 'react-awesome-calendar';
import { GetCalendarPaymentAndLotery } from '../api/calendar';
import { toast } from 'react-toast';
import { AxiosError } from 'axios';
import { HandleError } from '../helpers/handleError';
import { CalendarPaymentAndLotey } from '../interfaces/Calendar';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fafafa',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  title: {
    float: 'right',
    marginBottom: 10,
    color: theme.palette.secondary.main,
  },
}));

const CalendarView = () => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [Loading, setLoading] = useState<boolean>(false);
  const [Events, setEvents] = useState<CalendarPaymentAndLotey[]>([]);

  useEffect(() => {
    const fetchCalendar = async () => {
      setLoading(true);

      try {
        const { calendarPL } = await (await GetCalendarPaymentAndLotery({ token })).data;
        setEvents(calendarPL);
        setLoading(false);
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
        setLoading(false);
      }
    };

    fetchCalendar();
  }, []);

  return (
    <Page className={classes.root} title='Calendario'>
      <Container maxWidth='xl'>
        <Box mt={3} p={3}>
          <h2 className={classes.title}>Calendario de pagos y sorteos</h2>
          <br />
          {Loading ? <CircularProgress color='primary' /> : <Calendar events={Events} />}
        </Box>
      </Container>
    </Page>
  );
};

export default CalendarView;
