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
  CardHeader,
  Divider,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { toast } from 'react-toast';
import { useEffect, useState, Dispatch, SetStateAction, useContext } from 'react';
import { MeContext } from '../../context/contextMe';
import { AxiosError } from 'axios';
import { HandleError } from '../../helpers/handleError';
import { NewUser } from '../../api/users';
import { Rol } from '../../interfaces/Rol';
import { GetRoles } from '../../api/roles';
import { monthDiff } from '../../helpers/fechas';

interface Props {
  setReloadUser: Dispatch<SetStateAction<boolean>>;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export const FormNewUser = ({ setReloadUser, setVisible }: Props) => {
  const { token, me } = useContext(MeContext);
  const [Roles, setRoles] = useState<Rol[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { roles } = await (await GetRoles({ token })).data;

        if (me.idRol === 'RRHH' && roles?.length) {
          setRoles(roles.filter((item: Rol) => item.rol !== 'RRHH'));
        } else {
          setRoles(roles);
        }
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
      }
    };

    fetchRoles();
  }, [token, me]);

  return (
    <Card>
      <Formik
        initialValues={{
          nombres: '',
          apellidos: '',
          userName: '',
          email: '',
          password: '',
          idRol: '',
          sexo: '',
          razonSocial: '',
          idSucursal: '',
          fechaNacimiento: '',
        }}
        validationSchema={Yup.object().shape({
          nombres: Yup.string().max(100).required('El campo es requerido'),
          apellidos: Yup.string().max(100).required('El campo es requerido'),
          userName: Yup.string().max(100),
          email: Yup.string().email('Email invalido').max(100).required('El campo es requerido'),
          password: Yup.string().max(100).required('El campo es requerido'),
          idRol: Yup.string().max(100),
          sexo: Yup.string().max(100).required('El campo es requerido'),
          razonSocial: Yup.string().max(100).required('El campo es requerido'),
          fechaNacimiento: Yup.string().max(100).required('El campo es requerido'),
          idSucursal: Yup.string().max(100).required('El campo es requerido'),
        })}
        onSubmit={async (values, actions) => {
          if (me.idRol !== 'Director' && (!values.idRol || !Roles.length)) {
            toast.warn('Seleccione el rol');
            return;
          }

          if (new Date().getTime() < new Date(values.fechaNacimiento).getTime()) {
            toast.warn('La fecha de nacimiento debe ser menor a la fecha actual');
            return;
          }

          const diffMont = monthDiff({
            hasta: new Date(),
            desde: new Date(values.fechaNacimiento),
          });

          if (diffMont < 216) {
            toast.warn('El usuario debe tener como minimo 18 años de edad');
            return;
          }

          try {
            await NewUser({ token, data: values });
            setReloadUser(true);
            setVisible(false);
          } catch (error) {
            toast.error(HandleError(error as AxiosError));
          }

          actions.setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form onSubmit={handleSubmit}>
            <CardHeader title={`Crear nuevo usuario ${me.idRol === 'Director' ? 'RRHH' : ''}`} />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.nombres && errors.nombres)}
                    helperText={touched.nombres && errors.nombres}
                    fullWidth
                    name='nombres'
                    required
                    label='Nombres'
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    defaultValue={values.nombres}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Escriba sus nombres'}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.apellidos && errors.apellidos)}
                    helperText={touched.apellidos && errors.apellidos}
                    fullWidth
                    name='apellidos'
                    required
                    label='Apellidos'
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    defaultValue={values.apellidos}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Escriba sus apellidos'}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.userName && errors.userName)}
                    helperText={touched.userName && errors.userName}
                    fullWidth
                    name='userName'
                    label='Nombre de usuario'
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    defaultValue={values.userName}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Escriba un nombre de usuario'}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    fullWidth
                    name='email'
                    required
                    label='Email'
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    defaultValue={values.email}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Escriba una dirección de correo'}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                    fullWidth
                    name='password'
                    required
                    label='Contraseña'
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    defaultValue={values.email}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Escriba una contraseña mayor de 7 digitos'}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.razonSocial && errors.razonSocial)}
                    helperText={touched.razonSocial && errors.razonSocial}
                    fullWidth
                    name='razonSocial'
                    required
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    defaultValue={values.razonSocial}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Escriba la razon social'}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.fechaNacimiento && errors.fechaNacimiento)}
                    helperText={touched.fechaNacimiento && errors.fechaNacimiento}
                    fullWidth
                    name='fechaNacimiento'
                    type='date'
                    required
                    label='Nacimiento'
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    defaultValue={values.fechaNacimiento}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Seleccione su fecha de nacimiento'}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <InputLabel id='demo-simple-select-outlined-label'>Sexos</InputLabel>
                  <Select
                    labelId='demo-simple-select-outlined-label'
                    id='demo-simple-select-outlined'
                    style={{ width: '100%' }}
                    onChange={handleChange}
                    name='sexo'
                    label='Sexos'
                  >
                    {['Masculino', 'Femenino'].map(sexo => (
                      <MenuItem value={sexo} key={sexo}>
                        {sexo}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item md={6} xs={12}>
                  <InputLabel id='demo-simple-select-outlined-label'>Sucursales</InputLabel>
                  <Select
                    labelId='demo-simple-select-outlined-label'
                    id='demo-simple-select-outlined'
                    style={{ width: '100%' }}
                    onChange={handleChange}
                    name='idSucursal'
                    label='Sucursales'
                  >
                    {['1', '2', '3', '4'].map(suc => (
                      <MenuItem value={suc} key={suc}>
                        {suc}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                {me.idRol !== 'Director' ? (
                  <Grid item md={6} xs={12}>
                    <InputLabel id='demo-simple-select-outlined-label'>Roles</InputLabel>
                    <Select
                      labelId='demo-simple-select-outlined-label'
                      id='demo-simple-select-outlined'
                      style={{ width: '100%' }}
                      onChange={handleChange}
                      name='idRol'
                      label='Roles'
                    >
                      {Roles.map(rol => (
                        <MenuItem value={rol.idRol} key={rol.idRol}>
                          {rol.rol}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                ) : (
                  ''
                )}
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
                Registrar
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Card>
  );
};
