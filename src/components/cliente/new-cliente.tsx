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
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
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
import { monthDiff } from '../../helpers/fechas';
import { NewCliente } from '../../api/clientes';
import { GetCiudades } from '../../api/ciudades';
import { Ciudad } from '../../interfaces/Ciudad';
import { Autocomplete } from '@material-ui/lab';

interface Props {
  setReloadCliente: Dispatch<SetStateAction<boolean>>;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export const FormNewCliente = ({ setReloadCliente, setVisible }: Props) => {
  const { token, me } = useContext(MeContext);
  const [NotificationClient, setNotificationClient] = useState<{ sms: boolean; email: boolean }>({
    sms: false,
    email: false,
  });
  const [Ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [selectCity, setSelectCity] = useState<string>('');

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const { ciudades } = await (await GetCiudades({ token })).data;

        setCiudades(ciudades);
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
      }
    };

    fetchCity();
  }, [token, me]);

  return (
    <Card>
      <Formik
        initialValues={{
          nombres: '',
          apellidos: '',
          email: '',
          telefono: 0,
          ciudad: '',
          direccion: '',
          sexo: '',
          fechaNacimiento: '',
          rfc: '',
          notificarEmail: false,
          notificarSms: false,
        }}
        validationSchema={Yup.object().shape({
          nombres: Yup.string().max(100).required('El campo es requerido'),
          apellidos: Yup.string().max(100).required('El campo es requerido'),
          telefono: Yup.string().max(15),
          email: Yup.string().email('Email invalido').max(100).required('El campo es requerido'),
          ciudad: Yup.string().max(50),
          direccion: Yup.string().max(200),
          sexo: Yup.string().max(100),
          fechaNacimiento: Yup.string().max(100),
          rfc: Yup.string().max(25),
          notificarEmail: Yup.boolean(),
          notificarSms: Yup.boolean(),
        })}
        onSubmit={async (values, actions) => {
          if (values.fechaNacimiento) {
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
          }

          if (selectCity) {
            values.ciudad = Ciudades.find(city => city.ciudad === selectCity)?.idCiudad || '';

            if (!values.ciudad) {
              toast.warn('Seleccione una ciudad');
              return;
            }
          }

          if (!values.sexo) {
            values.sexo = 'No especificado';
          }

          if (NotificationClient.email) {
            values.notificarEmail = true;
          }

          if (NotificationClient.sms) {
            values.notificarSms = true;
          }

          try {
            const { mensaje } = await (await NewCliente({ token, data: values })).data;

            mensaje && toast.warn(mensaje);

            setReloadCliente(true);
            setVisible(false);
          } catch (error) {
            toast.error(HandleError(error as AxiosError));
          }

          actions.setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form onSubmit={handleSubmit}>
            <CardHeader title={'Crear nuevo cliente'} />
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
                    error={Boolean(touched.telefono && errors.telefono)}
                    helperText={touched.telefono && errors.telefono}
                    fullWidth
                    name='telefono'
                    type='number'
                    label='Telefono'
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    defaultValue={values.telefono}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Escriba un numero de telefono'}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    fullWidth
                    name='email'
                    required
                    type='email'
                    label='Correo'
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
                    error={Boolean(touched.fechaNacimiento && errors.fechaNacimiento)}
                    helperText={touched.fechaNacimiento && errors.fechaNacimiento}
                    fullWidth
                    name='fechaNacimiento'
                    type='date'
                    label='Nacimiento'
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    defaultValue={values.fechaNacimiento || '1990-01-01'}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Seleccione su fecha de nacimiento'}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.rfc && errors.rfc)}
                    helperText={touched.rfc && errors.rfc}
                    fullWidth
                    name='rfc'
                    label='RFC'
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Escriba el RFC'}
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
                <Grid item xs={12}>
                  <Autocomplete
                    id='combo-box-demo'
                    options={Ciudades}
                    getOptionLabel={option => option.ciudad}
                    getOptionSelected={(option, value) => {
                      setSelectCity(value.ciudad);
                      return true;
                    }}
                    style={{ width: '100%' }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        fullWidth
                        name='ciudad'
                        label='Ciudad'
                        disabled={isSubmitting}
                        variant='outlined'
                        placeholder={'Seleccione su ciudad'}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(touched.direccion && errors.direccion)}
                    helperText={touched.direccion && errors.direccion}
                    fullWidth
                    name='direccion'
                    multiline
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    defaultValue={values.direccion}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Especifique la dirección'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl component='fieldset'>
                    <FormLabel component='legend'>Notificar al cliente por</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={NotificationClient.email}
                            disabled={values.email.length === 0}
                            onChange={values =>
                              setNotificationClient({
                                ...NotificationClient,
                                email: values.target.checked,
                              })
                            }
                          />
                        }
                        label='Correo electronico'
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={NotificationClient.sms}
                            disabled={
                              values.telefono === 0 || values.telefono.toString().length === 0
                            }
                            onChange={values =>
                              setNotificationClient({
                                ...NotificationClient,
                                sms: values.target.checked,
                              })
                            }
                          />
                        }
                        label='Mensaje de texto'
                      />
                    </FormGroup>
                  </FormControl>
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
                Registrar
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Card>
  );
};
