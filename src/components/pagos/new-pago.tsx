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
import { Dispatch, SetStateAction, useContext } from 'react';
import { MeContext } from '../../context/contextMe';
import { AxiosError } from 'axios';
import { HandleError } from '../../helpers/handleError';
import { AddPagoCredito } from '../../api/pagos';
import { CurrentDate } from '../../helpers/fechas';

interface Props {
  setReloadPago: Dispatch<SetStateAction<boolean>>;
  setVisible: Dispatch<SetStateAction<boolean>>;
  idCredito: string;
  cliente: string;
}

export const FormNewPago = ({ setReloadPago, setVisible, idCredito, cliente }: Props) => {
  const { token } = useContext(MeContext);

  return (
    <Card>
      <Formik
        initialValues={{
          idCredito,
          pagadoEl: '',
          tipoDePago: '',
        }}
        validationSchema={Yup.object().shape({
          pagadoEl: Yup.string().max(100).required('El campo es requerido'),
          tipoDePago: Yup.string().max(100).required('El campo es requerido'),
        })}
        onSubmit={async (values, actions) => {
          if (new Date().getTime() < new Date(values.pagadoEl).getTime()) {
            toast.warn('La fecha de pago debe ser menor a la fecha actual');
            return;
          }

          try {
            await AddPagoCredito({ token, data: values });
            setReloadPago(true);
            setVisible(false);
          } catch (error) {
            toast.error(HandleError(error as AxiosError));
          }

          actions.setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form onSubmit={handleSubmit}>
            <CardHeader title={`Registrar pago de: ${cliente}`} />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <InputLabel id='demo-simple-select-outlined-label'>Tipo de pago</InputLabel>
                  <Select
                    labelId='demo-simple-select-outlined-label'
                    id='demo-simple-select-outlined'
                    style={{ width: '100%' }}
                    onChange={handleChange}
                    name='tipoDePago'
                    label='Tipo de pago'
                  >
                    {['Trasnferencia Bancaria', 'Deposito Bancario'].map(item => (
                      <MenuItem value={item} key={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.pagadoEl && errors.pagadoEl)}
                    helperText={touched.pagadoEl && errors.pagadoEl}
                    fullWidth
                    name='pagadoEl'
                    type='date'
                    required
                    label='Fecha de pago'
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    defaultValue={values.pagadoEl || CurrentDate()}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Seleccione su fecha de pago'}
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
                Registrar Pago
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Card>
  );
};
