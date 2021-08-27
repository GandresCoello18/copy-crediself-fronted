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
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { MeContext } from '../../context/contextMe';
import { AxiosError } from 'axios';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import { HandleError } from '../../helpers/handleError';
import { AddExpenses } from '../../api/caja-chica';
import { Autocomplete } from '@material-ui/lab';

interface Props {
  setReloadGasto: Dispatch<SetStateAction<boolean>>;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export const FormNewGasto = ({ setReloadGasto, setVisible }: Props) => {
  const { token } = useContext(MeContext);
  const [Concepto, setConcepto] = useState<string>('');
  const [IsConceptoInput, setIsConceptoInput] = useState<boolean>(false);

  return (
    <Card>
      <Formik
        initialValues={{
          concepto: '',
          observaciones: '',
          gasto: '',
        }}
        validationSchema={Yup.object().shape({
          concepto: Yup.string().max(100),
          observaciones: Yup.string().max(200),
          gasto: Yup.string().max(8).required('El campo es requerido'),
        })}
        onSubmit={async (values, actions) => {
          if (!Concepto) {
            toast.warn('Selecciona o escribe un concepto');
            return;
          }

          values.concepto = Concepto;

          try {
            await AddExpenses({ token, data: values });
            setReloadGasto(true);
            setVisible(false);
          } catch (error) {
            toast.error(HandleError(error as AxiosError));
          }

          actions.setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form onSubmit={handleSubmit}>
            <CardHeader title={'Registrar gasto'} />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid xs={1}>
                  <Box
                    onClick={() => setIsConceptoInput(!IsConceptoInput)}
                    title={
                      IsConceptoInput
                        ? 'Cambiar para seleccionar un concepto o servicio'
                        : 'Cambiar para escribe un nuevo concepto'
                    }
                    display='flex'
                    justifyContent='center'
                    mt={3}
                  >
                    <SwapVertIcon />
                  </Box>
                </Grid>
                <Grid item md={5} xs={11}>
                  {IsConceptoInput ? (
                    <TextField
                      fullWidth
                      name='concepto'
                      label='Concepto'
                      disabled={isSubmitting}
                      variant='outlined'
                      onChange={event => setConcepto(event.target.value)}
                      placeholder={'Escriba el concepto o servicio'}
                    />
                  ) : (
                    <Autocomplete
                      id='combo-box-demo'
                      options={['Servicio de internet', 'Papeleria', 'Mantenimiento de pc', 'Otro']}
                      getOptionLabel={option => option}
                      getOptionSelected={(option, value) => {
                        if (value === 'Otro') {
                          setIsConceptoInput(true);
                          return true;
                        }
                        setConcepto(value);
                        return true;
                      }}
                      style={{ width: '100%' }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={Boolean(touched.concepto && errors.concepto)}
                          helperText={touched.concepto && errors.concepto}
                          fullWidth
                          name='concepto'
                          label='Concepto'
                          variant='outlined'
                          onChange={event => setConcepto(event.target.value)}
                          placeholder={'Seleccione el concepto o servicio'}
                        />
                      )}
                    />
                  )}
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.gasto && errors.gasto)}
                    helperText={touched.gasto && errors.gasto}
                    fullWidth
                    name='gasto'
                    label='Gastos'
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    defaultValue={values.gasto}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Escriba el total de gastos'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(touched.observaciones && errors.observaciones)}
                    helperText={touched.observaciones && errors.observaciones}
                    fullWidth
                    multiline
                    name='observaciones'
                    label='Observaciones'
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    defaultValue={values.observaciones}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Escriba alguna observación o comentario (opcional)'}
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
                Registrar
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Card>
  );
};
