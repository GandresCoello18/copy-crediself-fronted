/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as Yup from 'yup';
import Alert from '@material-ui/lab/Alert';
import { Formik } from 'formik';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { toast } from 'react-toast';
import { useEffect, useState, Dispatch, SetStateAction, useContext } from 'react';
import { MeContext } from '../../context/contextMe';
import { AxiosError } from 'axios';
import { HandleError } from '../../helpers/handleError';
import { GetNotRolUser, NewUser } from '../../api/users';
import { Rol } from '../../interfaces/Rol';
import { GetRoles } from '../../api/roles';
import { monthDiff } from '../../helpers/fechas';
import { GetSucursales } from '../../api/sucursales';
import { Sucursal } from '../../interfaces/Sucursales';
import { SelectSupervisor } from './select-supervisor';
import { Usuario } from '../../interfaces/Usuario';
import { SourceAvatar } from '../../helpers/sourceAvatar';
import { DialogoForm } from '../DialogoForm';

interface Props {
  setReloadUser: Dispatch<SetStateAction<boolean>>;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export const FormNewUser = ({ setReloadUser, setVisible }: Props) => {
  const { token, me } = useContext(MeContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogo, setDialogo] = useState<boolean>(false);
  const [isReferido, setIsReferido] = useState<boolean>(false);
  const [Sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [UserNotRol, setUserNotRol] = useState<Usuario[]>([]);
  const [SelectUser, setSelectUser] = useState<Usuario | undefined>(undefined);
  const [Roles, setRoles] = useState<Rol[]>([]);
  const [Supervisor, setSupervisor] = useState<Usuario | undefined>(undefined);

  const fetchUserNotRol = async () => {
    setLoading(true);

    try {
      const { usuarios } = await (await GetNotRolUser({ token })).data;
      setLoading(false);
      setUserNotRol(usuarios);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isReferido) {
      fetchUserNotRol();
    }

    if (isReferido && !dialogo && !SelectUser) {
      setIsReferido(false);
    }
  }, [isReferido, dialogo, SelectUser]);

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

    const fetchSucursales = async () => {
      try {
        const { sucursales } = await (await GetSucursales({ token })).data;
        setSucursales(sucursales);
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
      }
    };

    fetchRoles();
    fetchSucursales();
  }, [token, me]);

  return (
    <>
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
            idSupervisor: '',
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
            idSucursal: Yup.string().max(100),
            idSupervisor: Yup.string().max(100),
          })}
          onSubmit={async (values, actions) => {
            if (me.idRol === 'Director' && (!values.idRol || !Roles.length)) {
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

            if (Supervisor) {
              const findRol = Roles.find(rol => rol.idRol === values.idRol);

              if (findRol?.rol !== 'Asesor') {
                toast.warn('No puedes asignar un supervisor a un usuario que no sea Asesor');
                return;
              }

              values.idSupervisor = Supervisor.idUser;
            }

            if (values.idRol && !values.idSucursal) {
              toast.warn(
                `Se necesita que escoja una sucursal para el rol ${
                  Roles.find(rol => rol.idRol === values.idRol)?.rol
                }`,
              );
              return;
            }

            try {
              await NewUser({ token, data: values, idReferido: SelectUser?.idUser });
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
                      defaultValue={values.fechaNacimiento || '1990-01-01'}
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
                      {Sucursales.map(suc => (
                        <MenuItem value={suc.idSucursal} key={suc.idSucursal}>
                          {suc.sucursal}
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
                  ) : null}
                  {Roles.find(rol => rol.idRol === values.idRol)?.rol === 'Asesor' ? (
                    <Grid item xs={12}>
                      <SelectSupervisor
                        token={token}
                        isSubmitting={isSubmitting}
                        setSupervisor={setSupervisor}
                      />
                    </Grid>
                  ) : null}

                  {Roles.find(rol => rol.idRol === values.idRol)?.rol === 'Asesor' ? (
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isReferido}
                            onChange={event => {
                              setIsReferido(event.target.checked);
                              setDialogo(event.target.checked);
                            }}
                          />
                        }
                        label='¿Es un usuario referido?'
                      />
                    </Grid>
                  ) : null}
                  {SelectUser ? (
                    <Grid item xs={12}>
                      <Card>
                        <CardHeader
                          avatar={
                            <Avatar
                              alt={SelectUser.nombres}
                              src={SourceAvatar(SelectUser.avatar)}
                            />
                          }
                          title={`${SelectUser.nombres} ${SelectUser.apellidos}`}
                          subheader={SelectUser.email}
                          action={
                            <div
                              onClick={() => {
                                setSelectUser(undefined);
                                setIsReferido(false);
                              }}
                            >
                              <CloseIcon style={{ cursor: 'pointer' }} />
                            </div>
                          }
                        />
                      </Card>
                    </Grid>
                  ) : null}
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

      <DialogoForm Open={dialogo} setOpen={setDialogo} title='Elige al usuario que Refirio'>
        <Box p={3} display='flex' justifyContent='center'>
          {loading ? (
            <CircularProgress color='secondary' />
          ) : (
            UserNotRol.map(user => (
              <Card
                style={{ cursor: 'pointer' }}
                key={user.idUser}
                onClick={() => {
                  setSelectUser(user);
                  setDialogo(false);
                }}
              >
                <CardHeader
                  avatar={<Avatar alt={user.nombres} src={SourceAvatar(user.avatar)} />}
                  title={`${user.nombres} ${user.apellidos}`}
                  subheader={user.email}
                />
              </Card>
            ))
          )}

          {!loading && !UserNotRol.length && (
            <Alert severity='info'>No se encontro usuarios referidos</Alert>
          )}
        </Box>
      </DialogoForm>
    </>
  );
};
