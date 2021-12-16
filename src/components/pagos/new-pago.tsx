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
  Chip,
  Divider,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { toast } from 'react-toast';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { MeContext } from '../../context/contextMe';
import { AxiosError } from 'axios';
import { HandleError } from '../../helpers/handleError';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import { AddPagoCredito, AperturaPagoCredito } from '../../api/pagos';
import { CurrentDate } from '../../helpers/fechas';
import { UploadImage } from '../UploadImage';
import { ImageListType } from 'react-images-uploading';

interface Props {
  setReloadPago: Dispatch<SetStateAction<boolean>>;
  setVisible: Dispatch<SetStateAction<boolean>>;
  idCredito: string;
  cliente: string;
  apertura?: boolean;
}

export const FormNewPago = ({ setReloadPago, setVisible, idCredito, cliente, apertura }: Props) => {
  const { token } = useContext(MeContext);
  const [images, setImages] = useState<ImageListType>([]);

  const onChange = (imageList: ImageListType) => setImages(imageList as never[]);

  const totalComisionBancaria = (valor: number) => {
    const comision = (valor * 4) / 100;
    return comision + valor;
  };

  return (
    <Card>
      <Formik
        initialValues={{
          idCredito,
          pagadoEl: '',
          tipoDePago: '',
          valor: '',
          observaciones: '',
        }}
        validationSchema={Yup.object().shape({
          pagadoEl: Yup.string().max(100).required('El campo es requerido'),
          tipoDePago: Yup.string().max(100).required('El campo es requerido'),
          valor: Yup.string().max(10).required('El campo es requerido'),
          observaciones: Yup.string().max(100),
        })}
        onSubmit={async (values, actions) => {
          if (new Date().getTime() < new Date(values.pagadoEl).getTime()) {
            toast.warn('La fecha de pago debe ser menor a la fecha actual');
            return;
          }

          const data = new FormData();
          data.append('idCredito', values.idCredito);
          data.append('pagadoEl', values.pagadoEl);
          data.append('tipoDePago', values.tipoDePago);
          data.append('valor', values.valor);
          data.append('observaciones', values.observaciones);

          if (images.length) {
            data.append('comprobante', images[0].file || '');
          }

          try {
            if (apertura) {
              await AperturaPagoCredito({ token, data });
            } else {
              await AddPagoCredito({ token, data });
            }

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
            <CardHeader
              title={`Registrar pago de ${apertura ? 'apertura para' : ''}: ${cliente}`}
            />
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
                    {['Tarjeta', 'Terminal Bancario', 'Transferencia', 'Deposito'].map(item => (
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
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.valor && errors.valor)}
                    helperText={touched.valor && errors.valor}
                    fullWidth
                    name='valor'
                    type='number'
                    required
                    label='Valor pagado'
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Escriba el valor pagado'}
                  />
                </Grid>
                {values.tipoDePago === 'Terminal Bancario' && (
                  <>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label='Comision bancaria'
                        disabled={true}
                        value='4%'
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <Chip
                        avatar={<MonetizationOnIcon />}
                        label={`Total: ${totalComisionBancaria(Number(values.valor))}`}
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <UploadImage images={images} maxNumber={1} onChange={onChange} />
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(touched.observaciones && errors.observaciones)}
                    helperText={touched.observaciones && errors.observaciones}
                    fullWidth
                    name='observaciones'
                    type='number'
                    multiline
                    label='Observaciones'
                    onBlur={handleBlur}
                    rows={4}
                    disabled={isSubmitting}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Escriba alguna observaciòn (opcional)'}
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
