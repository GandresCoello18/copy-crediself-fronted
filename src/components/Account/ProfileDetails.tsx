/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from '@material-ui/core';
import { useContext } from 'react';
import { MeContext } from '../../context/contextMe';
import { UpdateUser } from '../../api/users';
import { toast } from 'react-toast';
import { AxiosError } from 'axios';
import { HandleError } from '../../helpers/handleError';

export const ProfileDetails = () => {
  const { me, setMe, token } = useContext(MeContext);

  return (
    <>
      <Formik
        initialValues={{
          email: me.email,
          userName: me.userName,
          nombres: me.nombres,
          apellidos: me.apellidos,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Esta direccion es invalida').max(100),
          userName: Yup.string().max(100),
          nombres: Yup.string().max(100),
          apellidos: Yup.string().max(100),
        })}
        onSubmit={async (values, actions) => {
          try {
            await UpdateUser({ token, data: values });
            toast.success('Se actualizaron los datos');
            setMe({
              ...me,
              ...values,
            });
          } catch (error) {
            toast.error(HandleError(error as AxiosError));
          }

          actions.setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader subheader='Esta información es modificable' title='Perfil' />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={Boolean(touched.userName && errors.userName)}
                      helperText={touched.userName && errors.userName}
                      fullWidth
                      label='Nombre de usuario'
                      name='userName'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant='outlined'
                      defaultValue={values.userName}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                      fullWidth
                      name='email'
                      label='Dirección de correo'
                      onBlur={handleBlur}
                      variant='outlined'
                      onChange={handleChange}
                      defaultValue={values.email}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={Boolean(touched.nombres && errors.nombres)}
                      helperText={touched.nombres && errors.nombres}
                      fullWidth
                      name='nombres'
                      onBlur={handleBlur}
                      label='Nombres'
                      onChange={handleChange}
                      variant='outlined'
                      placeholder='Escriba sus nombres completos'
                      defaultValue={values.nombres}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={Boolean(touched.apellidos && errors.apellidos)}
                      helperText={touched.apellidos && errors.apellidos}
                      fullWidth
                      name='apellidos'
                      onBlur={handleBlur}
                      label='Apellidos'
                      onChange={handleChange}
                      variant='outlined'
                      placeholder='Escriba sus apellidos completos'
                      defaultValue={values.apellidos}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Te uniste el'
                      disabled
                      value={me.created_at}
                      variant='outlined'
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <Box display='flex' justifyContent='flex-end' p={2}>
                <Button
                  color='secondary'
                  disabled={isSubmitting}
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                >
                  Actualizar datos
                </Button>
              </Box>
            </Card>
          </form>
        )}
      </Formik>
    </>
  );
};
