/* eslint-disable no-undef */
/* eslint-disable react/react-in-jsx-scope */
import {
  Container,
  Box,
  makeStyles,
  CircularProgress,
  Checkbox,
  Card,
  Typography,
  Button,
  CardContent,
  FormControlLabel,
  Grid,
  TextField,
  Divider,
} from '@material-ui/core';
import Page from '../components/page';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { TimeMessage } from '../interfaces/Time-Message';
import { AxiosError } from 'axios';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toast';
import { getTimeMessage } from '../api/time-message';
import { HandleError } from '../helpers/handleError';
import { Formik } from 'formik';
import { UpdatePasswordEmail } from '../api/users';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#f2f2f2',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  center: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: theme.typography.h2,
  card: {
    padding: 30,
    textAlign: 'center',
  },
  backCard: {
    backgroundColor: 'rgb(246, 246, 246)',
  },
}));

export const RestaurarCuenta = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const params = useParams();
  const [Loading, setLoading] = useState<boolean>(false);
  const [visibleKey, setVisibleKey] = useState<boolean>(false);
  const [Message, setMessage] = useState<TimeMessage | undefined>();

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const { message } = await (await getTimeMessage({ idMessage: params?.idTimeMessage })).data;
        setMessage(message);

        setLoading(false);
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
        setLoading(false);
      }
    };

    if (!params?.idTimeMessage) {
      navigate('/password-reset');
    } else {
      fetchMessage();
    }
  }, [params, navigate]);

  return (
    <Page className={classes.root} title='Recuperar cuenta'>
      <Container maxWidth='lg'>
        <Box className={classes.center}>
          <Box justifyContent='center'>
            <Card className={classes.card}>
              {Loading && <CircularProgress color='secondary' />}

              {!Message && !Loading && (
                <>
                  <Typography className={classes.title}>¡No encontramos tu mensaje!</Typography>
                  <br />
                  <Typography>
                    El enlace es inválido, probablemente porque ya fue usado o asegurate de hacer
                    click en el enlace enviado a tu dirección de correo.
                  </Typography>
                </>
              )}

              {Message &&
                !Loading &&
                (Message.status === 'Expirado' ? (
                  <>
                    <Typography className={classes.title}>¡Mensaje expirado!</Typography>
                    <br />
                    <Typography>
                      Este mensaje solo sera valido por{' '}
                      <strong>{Message.life_minutes} minutos</strong> desde el momento en que se
                      envió el mensaje. <br /> Intente solicitar otra vez el cambio de contraseña.
                    </Typography>
                  </>
                ) : (
                  <CardContent>
                    <Typography className={classes.title}>Recuperar tu cuenta</Typography>
                    <br />
                    <Formik
                      initialValues={{
                        newKey: '',
                        newKeyConfirm: '',
                      }}
                      validationSchema={Yup.object().shape({
                        newKey: Yup.string().max(100).required('El campo es requerido'),
                        newKeyConfirm: Yup.string().max(100).required('El campo es requerido'),
                      })}
                      onSubmit={async (values, actions) => {
                        const { newKey, newKeyConfirm } = values;
                        setLoading(true);

                        try {
                          if (newKey !== newKeyConfirm) {
                            toast.warn('Las contraseñas no son iguales, intentalo otra vez.');
                            setLoading(false);
                            return;
                          }

                          if (newKey.length < 7) {
                            toast.warn(
                              'La contraseña debe tener 7 o mas caracteres, intentalo otra vez.',
                            );
                            setLoading(false);
                            return;
                          }

                          await UpdatePasswordEmail({
                            newKey,
                            email: Message.destination,
                          });
                          navigate('/login');
                        } catch (error) {
                          toast.error(HandleError(error as AxiosError));
                        }

                        actions.setSubmitting(false);
                      }}
                    >
                      {({
                        errors,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        touched,
                      }) => (
                        <form onSubmit={handleSubmit}>
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <TextField
                                error={Boolean(touched.newKey && errors.newKey)}
                                helperText={touched.newKey && errors.newKey}
                                fullWidth
                                name='newKey'
                                type={visibleKey ? 'text' : 'password'}
                                required
                                label='Nueva contraseña'
                                onBlur={handleBlur}
                                disabled={isSubmitting}
                                variant='outlined'
                                onChange={handleChange}
                                placeholder={'Escriba su nueva contraseña'}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                error={Boolean(touched.newKeyConfirm && errors.newKeyConfirm)}
                                helperText={touched.newKeyConfirm && errors.newKeyConfirm}
                                fullWidth
                                name='newKeyConfirm'
                                type={visibleKey ? 'text' : 'password'}
                                required
                                label='Confirme tu contraseña'
                                onBlur={handleBlur}
                                disabled={isSubmitting}
                                variant='outlined'
                                onChange={handleChange}
                                placeholder={'Vuelva ha escribir su contraseña'}
                              />
                            </Grid>
                          </Grid>
                          <Box p={1} display='flex' justifyContent='space-between'>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={visibleKey}
                                  onChange={check => setVisibleKey(check.target.checked)}
                                  inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                              }
                              label='Mostrar contraseña'
                            />
                          </Box>
                          <Box display='flex' justifyContent='flex-start' mt={1}>
                            <Button
                              color='secondary'
                              disabled={isSubmitting}
                              size='large'
                              type='submit'
                              fullWidth
                              variant='contained'
                            >
                              Cambiar contraseña
                            </Button>
                          </Box>
                        </form>
                      )}
                    </Formik>
                  </CardContent>
                ))}
            </Card>
            <Divider />
            <Card className={`${classes.card} ${classes.backCard}`}>
              <Typography>¿Necesitas cambiar de contraseña?</Typography>
              <br />
              <Link to='/reset-password'>
                <Typography color='primary'>Cambiar contraseña</Typography>
              </Link>
            </Card>
          </Box>
        </Box>
      </Container>
    </Page>
  );
};
