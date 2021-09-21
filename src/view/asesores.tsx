/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { Container, makeStyles, Box, Avatar, Card, Typography, Grid } from '@material-ui/core';
import Page from '../components/page';
import { useContext, useEffect, useState } from 'react';
import { MeContext } from '../context/contextMe';
import { toast } from 'react-toast';
import { AxiosError } from 'axios';
import { HandleError } from '../helpers/handleError';
import { Usuario } from '../interfaces/Usuario';
import { SourceAvatar } from '../helpers/sourceAvatar';
import { Alert, Skeleton } from '@material-ui/lab';
import { GetMisAsesoresUser } from '../api/users';

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
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64,
  },
}));

const AsesoresView = () => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [Asesores, setAsesores] = useState<Usuario[]>([]);
  const [Loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAsesores = async () => {
      setLoading(true);

      try {
        const { asesores } = await (await GetMisAsesoresUser({ token })).data;
        setAsesores(asesores);
        setLoading(false);
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
        setLoading(false);
      }
    };

    fetchAsesores();
  }, []);

  const renderCardAsesores = () => {
    return (
      <Grid container spacing={3} direction='row' justify='center' alignItems='center'>
        {Asesores.map(asesor => (
          <Grid item key={asesor.idUser}>
            <Card>
              <Box alignItems='center' display='flex' flexDirection='column' p={3}>
                <Avatar className={classes.avatar} src={SourceAvatar(asesor.avatar || '')} />
                <Typography color='textPrimary' variant='h5'>
                  {asesor.nombres + ' ' + asesor.apellidos}
                </Typography>
                <Typography color='textSecondary' variant='body2'>
                  {asesor.idRol}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderSkeleton = () => {
    return (
      <Grid container spacing={3} direction='row' justify='center' alignItems='center'>
        {[1, 2, 3, 4, 5].map(item => (
          <Grid item xs={12} md={4} lg={3} key={item}>
            <Skeleton variant='rect' width={300} height={250} />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Page className={classes.root} title='Asesores'>
      <Container maxWidth='xl'>
        <Box mt={3} p={3}>
          <h2 className={classes.title}>Asesores asignados</h2>
          <br />
          {Loading ? renderSkeleton() : renderCardAsesores()}
          {!Loading && !Asesores.length && (
            <Alert color='info'>
              No hay <strong>asesores</strong> para mostrar
            </Alert>
          )}
        </Box>
      </Container>
    </Page>
  );
};

export default AsesoresView;
