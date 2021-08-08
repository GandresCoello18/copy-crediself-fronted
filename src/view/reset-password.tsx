/* eslint-disable no-undef */
/* eslint-disable react/react-in-jsx-scope */
import {
  Container,
  Box,
  makeStyles,
  Card,
  CardContent,
  Divider,
  Typography,
  Button,
  Grid,
  TextField,
} from '@material-ui/core';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import { toast } from 'react-toast';
import Page from '../components/page';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { HandleError } from '../helpers/handleError';
import { newTimeMessage } from '../api/time-message';
import { useState } from 'react';

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
  backCard: {
    backgroundColor: 'rgb(246, 246, 246)',
  },
  card: {
    padding: 30,
  },
  title: theme.typography.h3,
}));

export const ResetPassword = () => {
  const classes = useStyles();
  const [Send, setSend] = useState<{ email: string; send: boolean }>({
    email: '',
    send: false,
  });

  return (
    <Page className={classes.root} title='Restaurar Contraseña'>
      <Container maxWidth='lg'>
        <Box className={classes.center}>
          <Box justifyContent='center'>
            {Send.send ? (
              <Card className={classes.card}>
                <Box textAlign='center'>
                  <MailOutlineIcon style={{ fontSize: 60 }} />
                  <Typography className={classes.title}>
                    Revisa tu correo y sigue las instrucciones
                  </Typography>
                  <br />
                  <Typography>
                    Te hemos enviado un correo a <strong>{Send.email}</strong> con las instrucciones
                    para cambiar tu contraseña. <br /> Si no logras encontrarlo, revisa en la
                    bandeja de spam.
                  </Typography>
                </Box>
              </Card>
            ) : (
              <Card className={classes.card}>
                <Typography className={classes.title}>
                  Revisa tu correo y sigue las instrucciones
                </Typography>
                <br />
                <Typography>
                  Te enviaremos un enlace a tu correo para que puedas acceder a tu cuenta
                </Typography>
                <br />
                <Divider />
                <CardContent>
                  <Formik
                    initialValues={{
                      email: '',
                    }}
                    validationSchema={Yup.object().shape({
                      email: Yup.string()
                        .email('Direcciòn de email envalido')
                        .max(100)
                        .required('El campo es requerido'),
                    })}
                    onSubmit={async (values, actions) => {
                      try {
                        const subject = 'Recuperar Contraseña';
                        await newTimeMessage({ destination: values.email, subject });
                        setSend({
                          email: values.email,
                          send: true,
                        });
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
                              error={Boolean(touched.email && errors.email)}
                              helperText={touched.email && errors.email}
                              fullWidth
                              name='email'
                              type='email'
                              required
                              label='Dirección de correo'
                              onBlur={handleBlur}
                              disabled={isSubmitting}
                              variant='outlined'
                              onChange={handleChange}
                              placeholder={'Escriba su dirección de correo'}
                            />
                          </Grid>
                        </Grid>
                        <Box display='flex' justifyContent='flex-start' mt={1}>
                          <Button
                            color='secondary'
                            disabled={isSubmitting}
                            size='large'
                            type='submit'
                            variant='contained'
                          >
                            Recuperar cuenta
                          </Button>
                        </Box>
                      </form>
                    )}
                  </Formik>
                </CardContent>
              </Card>
            )}
            <Divider />
            <Card className={`${classes.card} ${classes.backCard}`}>
              <Box display='flex' justifyContent='center'>
                <Box textAlign='center'>
                  <Typography>¿Ya tienes una cuenta?</Typography>
                  <br />
                  <Button variant='outlined'>
                    <Link to='/login'>
                      <Typography color='primary'>Inicia Sesión</Typography>
                    </Link>
                  </Button>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>
      </Container>
    </Page>
  );
};
