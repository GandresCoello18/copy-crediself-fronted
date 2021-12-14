/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
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
import SearchIcon from '@material-ui/icons/Search';
import { MeContext } from '../context/contextMe';
import { toast } from 'react-toast';
import { AxiosError } from 'axios';
import { HandleError } from '../helpers/handleError';
import { Comision } from '../interfaces/Comision';
import { GetComisiones, UpdateComision } from '../api/comisiones';
import { Skeleton } from '@material-ui/lab';
import { CardComision } from '../components/Comisiones/card-comision';

const useStyles = makeStyles(theme => ({
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

const ComisionesView = () => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [Search, setSearch] = useState<string>('');
  const [Comisiones, setComisiones] = useState<Comision[]>([]);
  const [Loading, setLoading] = useState<boolean>(false);
  const [Reload, setReload] = useState<boolean>(false);

  const fetchComisiones = async () => {
    setLoading(true);

    try {
      const { comisiones } = await (await GetComisiones({ token })).data;
      setComisiones(comisiones);
      setLoading(false);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComisiones();
  }, []);

  useEffect(() => {
    if (Reload) {
      setReload(false);
      fetchComisiones();
    }
  }, [Reload]);

  const HandleUpdatePorcentaje = async (idComision: string, porcentaje: number) => {
    try {
      console.log(idComision + ' hasta aqui llego la comision con ' + porcentaje);
      await UpdateComision({ token, idComision, porcentaje });
      toast.success('Se actualizo los valores de comision');
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
    }
  };

  const SkeletonCardComision = () => {
    return (
      <Grid spacing={3} container justify='center' direction='row' alignItems='center'>
        {[0, 1, 2, 3, 4].map(item => (
          <Grid item key={item}>
            <Skeleton style={{ marginBottom: 10 }} variant='rect' width={350} height={190} />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Page className={classes.root} title='Comisiones'>
      <Container maxWidth='lg'>
        <Box mt={3}>
          <Card>
            <CardContent>
              <Box maxWidth={500}>
                <TextField
                  fullWidth
                  onChange={event => setSearch(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SvgIcon fontSize='small' color='action'>
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder='Buscar comision'
                  variant='outlined'
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box mt={3}>
          {Loading && SkeletonCardComision()}

          <br />

          <Grid spacing={3} container direction='row' justify='center' alignItems='center'>
            {!Loading &&
              Comisiones.filter(com =>
                com.descripcion?.toUpperCase().includes(Search.toUpperCase()),
              ).map(com => (
                <Grid item xs={12} md={4} key={com.idComision}>
                  <CardComision comision={com} UpdatePorcentaje={HandleUpdatePorcentaje} />
                </Grid>
              ))}
          </Grid>
        </Box>
      </Container>
    </Page>
  );
};

export default ComisionesView;
