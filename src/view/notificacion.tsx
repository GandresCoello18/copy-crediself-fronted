/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { Container, makeStyles, Box, Grid, Divider, List } from '@material-ui/core';
import Page from '../components/page';
import { useState, useEffect, useContext } from 'react';
import { MeContext } from '../context/contextMe';
import Pagination from '@material-ui/lab/Pagination';
import { toast } from 'react-toast';
import { AxiosError } from 'axios';
import { HandleError } from '../helpers/handleError';
import { Alert, Skeleton } from '@material-ui/lab';
import { NotificacionByMe } from '../interfaces/Notificacion';
import { GetNotificacion } from '../api/notificacion';
import { DetailsNotificacion } from '../components/Notificaciones/details-notificacion';
import { ItemNotification } from '../components/Notificaciones/item-notificacion';
import { ActionNotification } from '../components/Notificaciones/action-notificacion';

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
  inline: {
    display: 'inline',
  },
  containerList: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
}));

const NotificacionView = () => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [Notificaciones, setNotificaciones] = useState<NotificacionByMe[]>([]);
  const [Count, setCount] = useState<number>(0);
  const [Notification, setNotification] = useState<NotificacionByMe>();
  const [ReloadNotificacion, setReloadNotificacion] = useState<boolean>(false);
  const [Loading, setLoading] = useState<boolean>(false);

  const SkeletonNotificacion = () => {
    return (
      <Grid container style={{ backgroundColor: '#fff', padding: 10 }}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map(item => (
          <>
            <Grid item xs={2} lg={1} key={item}>
              <Skeleton variant='circle' width={40} height={40} />
            </Grid>
            <Grid item xs={10} lg={11} key={item}>
              <Skeleton variant='text' width='50%' height={20} />
              <Skeleton variant='text' width='100%' height={40} />
            </Grid>
            <Grid item xs={12} style={{ marginBottom: 20 }} />
          </>
        ))}
      </Grid>
    );
  };

  const fetchNotificacion = async (page: number) => {
    setLoading(true);
    const queryUrl = new URLSearchParams(location.search).get('idNotificacion') as string;

    try {
      const { notifications, pages } = await (await GetNotificacion({ token, page })).data;
      setNotificaciones(notifications);
      setLoading(false);
      setCount(pages || 1);

      if (notifications && queryUrl) {
        const findNoti = notifications.find(
          (item: NotificacionByMe) => item.idNotification === queryUrl,
        );
        setNotification(findNoti);
      }
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificacion(1);

    if (ReloadNotificacion) {
      setReloadNotificacion(false);
    }
  }, [ReloadNotificacion]);

  const SelectItemPagination = (page: number) => fetchNotificacion(page);

  return (
    <Page className={classes.root} title='Usuarios'>
      <Container maxWidth='lg'>
        {Loading && SkeletonNotificacion()}
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            lg={7}
            style={{ backgroundColor: '#fff', borderBottom: '1px solid #cdcdcd' }}
          >
            <Box mt={3}>
              <ActionNotification
                VisibleViewAll={false}
                setReloadNotificacion={setReloadNotificacion}
              />
              <List className={classes.containerList}>
                {!Loading && !Notificaciones.length && (
                  <Alert severity='info'>
                    Por el momento no hay <strong>Notificaciones</strong> para mostrar.
                  </Alert>
                )}

                {!Loading &&
                  Notificaciones.map(notificacion => (
                    <Box key={notificacion.idNotification}>
                      <ItemNotification
                        notificacion={notificacion}
                        setNotification={setNotification}
                      />
                      <Divider variant='inset' component='li' />
                    </Box>
                  ))}
              </List>
            </Box>
            <Box mt={3} display='flex' justifyContent='center'>
              <Pagination
                count={Count}
                color='secondary'
                onChange={(event, page) => SelectItemPagination(page)}
              />
            </Box>
          </Grid>
          <Grid item xs={12} lg={5} style={{ backgroundColor: '#fff' }}>
            <DetailsNotificacion notifiacion={Notification} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default NotificacionView;
