/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { Container, makeStyles, Box, Grid } from '@material-ui/core';
import Page from '../components/page';
import Alert from '@material-ui/lab/Alert';
import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toast';
import { MeContext } from '../context/contextMe';
import { AxiosError } from 'axios';
import { HandleError } from '../helpers/handleError';
import { useParams } from 'react-router';
import { GetComisionByUser } from '../api/comisiones';
import { useNavigate } from 'react-router-dom';
import { MisComisiones } from '../interfaces/Comision';
import { TableCoomision } from '../components/Comisiones/table-comision';
import { RenderMainViewRol } from '../helpers/renderViewMainRol';

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

const ComuisionUser = () => {
  const params = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const { token, me } = useContext(MeContext);
  const [Loading, setLoading] = useState<boolean>(false);
  const [Comision, setComision] = useState<MisComisiones | undefined>(undefined);

  const FetchComision = async () => {
    setLoading(true);

    try {
      const { comisiones } = await (
        await GetComisionByUser({ token, idComisionUser: params.idComisionUser as string })
      ).data;

      setComision(comisiones);
      setLoading(false);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.idComisionUser) {
      FetchComision();
    } else {
      navigate(RenderMainViewRol(me.idRol));
    }
  }, [params]);

  return (
    <Page className={classes.root} title='Comision de usuario'>
      <Container maxWidth='xl'>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {!Comision && !Loading ? (
              <Alert severity='info'>No se encontro comision del usuario</Alert>
            ) : null}
            <br />

            {Comision ? (
              <Box mt={3}>
                <TableCoomision comision={[Comision]} Loading={Loading} />
              </Box>
            ) : null}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ComuisionUser;
