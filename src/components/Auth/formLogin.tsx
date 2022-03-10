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
  Typography,
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
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useContext, useState } from 'react';
import { MeContext } from '../../context/contextMe';
import { RenderMainViewRol } from '../../helpers/renderViewMainRol';
import { AxiosError } from 'axios';
import { HandleError } from '../../helpers/handleError';

export const Login = () => {
  const navigate = useNavigate();
  const { setMe, setToken } = useContext(MeContext);
  const [visibleKey, setVisibleKey] = useState<boolean>(false);
  const [Loading, setLoading] = useState<boolean>(false);

  return (
    <Card>
      <br />
      {!localStorage.getItem('empresa-hass-user') && (
        <img src='./placeholder-picture.png' alt='sin logo' title='sin logo' width={200} />
      )}
      {localStorage.getItem('empresa-hass-user')?.includes('CREDISELF') && (
        <img src='/logo-crediself.png' alt='Logo crediself' width={200} />
      )}
      {localStorage.getItem('empresa-hass-user')?.includes('AUTOIMPULZADORA') && (
        <img src='/auto-impulsadora-logo.jpg' alt='Logo auto impulsadora' width={200} />
      )}
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
            setToken(response.me.token);

            const tresHoras = new Date(new Date().getTime() + 180 * 60 * 1000);
            Cookies.set('access-token-crediself', response.me.token, { expires: tresHoras });
            response.me.user.empresa &&
              localStorage.setItem('empresa-hass-user', response.me.user.empresa);

            setTimeout(() => navigate(RenderMainViewRol(response.me.user.idRol)), 1000);
          } catch (error) {
            toast.error(HandleError(error as AxiosError));
            setLoading(false);
          }

          actions.setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched }) => (
          <form onSubmit={handleSubmit}>
            <CardHeader subheader='Acceso para personal administrativo' title='Iniciar sesión' />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    fullWidth
                    id='email'
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
                    id='password'
                    name='password'
                    onBlur={handleBlur}
                    type={visibleKey ? 'text' : 'password'}
                    onChange={handleChange}
                    variant='outlined'
                    placeholder={'Clave secreta'}
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

                <Link to='/reset-password'>
                  <Typography color='primary' style={{ marginTop: 10 }}>
                    ¿Olvidastes tu contraseña?
                  </Typography>
                </Link>
              </Box>
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
