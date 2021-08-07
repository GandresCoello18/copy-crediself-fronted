/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { LoginAccess } from '../../api/users';
import { toast } from 'react-toast';
import Cookies from 'js-cookie';
import { useContext, useState } from 'react';
import { MeContext } from '../../context/contextMe';
import { RenderMainViewRol } from '../../helpers/renderViewMainRol';
import { AxiosError } from 'axios';
import { HandleError } from '../../helpers/handleError';

export const Login = () => {
  const { setMe } = useContext(MeContext);
  const [visibleKey, setVisibleKey] = useState<boolean>(false);
  const [Loading, setLoading] = useState<boolean>(false);

  return (
    <Card>
      <img src='/logo-crediself.png' alt='Logo cici' width={200} />
      <br />
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email('Dirección de correo invalido')
            .max(100)
            .required('El email es requerido'),
          password: Yup.string().max(100).required('El password de usuario es requerido'),
        })}
        onSubmit={async (values, actions) => {
          setLoading(true);

          try {
            const response = await (await LoginAccess({ token: undefined, data: values })).data;
            setMe(response.me.user);

            const tresHoras = new Date(new Date().getTime() + 180 * 60 * 1000);
            Cookies.set('access-token-crediself', response.me.token, { expires: tresHoras });

            window.location.href = RenderMainViewRol(response.me.user.idRol);
          } catch (error) {
            toast.error(HandleError(error as AxiosError));
            setLoading(false);
          }

          actions.setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched }) => (
          <form onSubmit={handleSubmit}>
            <CardHeader subheader='Acceso para personal de crediself' title='Iniciar sesión' />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    fullWidth
                    name='email'
                    required
                    onBlur={handleBlur}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Direccion de email'}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                    fullWidth
                    required
                    name='password'
                    onBlur={handleBlur}
                    type={visibleKey ? 'text' : 'password'}
                    onChange={handleChange}
                    variant='outlined'
                    placeholder={'Clave secreta'}
                  />
                </Grid>
                <Grid xs={9} sm={4} md={4}>
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
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <Box display='flex' justifyContent='flex-end' p={2}>
              {Loading ? (
                <CircularProgress color='secondary' />
              ) : (
                <Button
                  color='secondary'
                  disabled={isSubmitting}
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                >
                  Entrar
                </Button>
              )}
            </Box>
          </form>
        )}
      </Formik>
    </Card>
  );
};
