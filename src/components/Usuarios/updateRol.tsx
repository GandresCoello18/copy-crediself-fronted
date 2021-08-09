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
} from '@material-ui/core';
import { toast } from 'react-toast';
import { useEffect, useState, Dispatch, SetStateAction, useContext } from 'react';
import { MeContext } from '../../context/contextMe';
import { AxiosError } from 'axios';
import { HandleError } from '../../helpers/handleError';
import { UpdateRolUser } from '../../api/users';
import { Rol } from '../../interfaces/Rol';
import { GetRoles } from '../../api/roles';
import { Usuario } from '../../interfaces/Usuario';

interface Props {
  setReloadUser: Dispatch<SetStateAction<boolean>>;
  setVisible: Dispatch<SetStateAction<boolean>>;
  User: Usuario | undefined;
}

export const FormUpdateRol = ({ setReloadUser, setVisible, User }: Props) => {
  const { token } = useContext(MeContext);
  const [Roles, setRoles] = useState<Rol[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { roles } = await (await GetRoles({ token })).data;
        setRoles(roles);
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
      }
    };

    fetchRoles();
  }, [token]);

  return (
    <Card>
      <Formik
        initialValues={{
          idRol: '',
        }}
        validationSchema={Yup.object().shape({
          idRol: Yup.string().max(100).required('El campo es requerido'),
        })}
        onSubmit={async (values, actions) => {
          if (!values.idRol || !Roles.length) {
            toast.warn('Seleccione el rol');
            return;
          }

          try {
            User && (await UpdateRolUser({ token, idRol: values.idRol, idUser: User.idUser }));
            setReloadUser(true);
            setVisible(false);
          } catch (error) {
            toast.error(HandleError(error as AxiosError));
          }

          actions.setSubmitting(false);
        }}
      >
        {({ handleChange, handleSubmit, isSubmitting, values }) => (
          <form onSubmit={handleSubmit}>
            <CardHeader
              title={`Cambiar rol de ( ${User?.nombres.toUpperCase()} ) desde ( ${
                User?.idRol
              } ) a ( ${Roles.find(rol => rol.idRol === values.idRol)?.rol} )`}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
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
                    {Roles.filter(rol => rol.rol !== User?.idRol).map(rol => (
                      <MenuItem value={rol.idRol} key={rol.idRol}>
                        {rol.rol}
                      </MenuItem>
                    ))}
                  </Select>
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
                Guardar
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Card>
  );
};
