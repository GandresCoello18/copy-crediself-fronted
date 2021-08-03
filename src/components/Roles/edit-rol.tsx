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
  TextField,
} from '@material-ui/core';
import { toast } from 'react-toast';
import { Dispatch, SetStateAction, useContext } from 'react';
import { MeContext } from '../../context/contextMe';
import { UpdateRole } from '../../api/roles';

interface Props {
  IdRol: string;
  descripcion: string;
  setReloadRol: Dispatch<SetStateAction<boolean>>;
}

export const FormEditRol = ({ IdRol, descripcion, setReloadRol }: Props) => {
  const { token } = useContext(MeContext);

  return (
    <Card>
      <Formik
        initialValues={{
          descripcion,
        }}
        validationSchema={Yup.object().shape({
          descripcion: Yup.string().max(100).required('El campo es requerido'),
        })}
        onSubmit={async (values, actions) => {
          console.log(values);

          try {
            await UpdateRole({ token, descripcion: values.descripcion, IdRol });
            setReloadRol(true);
          } catch (error) {
            if (error.request.response) {
              toast.error(JSON.parse(error.request.response).status);
            } else {
              toast.error(error.message);
            }
          }

          actions.setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form onSubmit={handleSubmit}>
            <CardHeader title='Actualizar Rol' />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(touched.descripcion && errors.descripcion)}
                    helperText={touched.descripcion && errors.descripcion}
                    fullWidth
                    name='descripcion'
                    required
                    label='Descripción'
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    defaultValue={values.descripcion}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Agrege una descripción'}
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
                Guardar
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Card>
  );
};
