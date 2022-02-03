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
  Popover,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { toast } from 'react-toast';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { MeContext } from '../../context/contextMe';
import { AxiosError } from 'axios';
import { HandleError } from '../../helpers/handleError';
import { NewContrato } from '../../api/credito';

interface Props {
  setReloadCredito?: Dispatch<SetStateAction<boolean>>;
  setVisible: Dispatch<SetStateAction<boolean>>;
  idCliente: string;
}

export const FormNewCredit = ({ setReloadCredito, setVisible, idCliente }: Props) => {
  const { token } = useContext(MeContext);
  const [isPopover, setIsPopover] = useState<boolean>(false);

  const CreditoByClientSection = () => {
    setVisible(false);
    window.location.href = `/app/creditos/cliente/${idCliente}`;
  };

  return (
    <Card>
      <Formik
        initialValues={{
          tipo: '',
          monto: '',
          idCliente,
        }}
        validationSchema={Yup.object().shape({
          tipo: Yup.string().max(100).required('El campo es requerido'),
          monto: Yup.string().max(100).required('El campo es requerido'),
        })}
        onSubmit={async (values, actions) => {
          try {
            const { status } = await (await NewContrato({ token, data: values })).data;

            if (setReloadCredito) {
              setReloadCredito(true);
            } else {
              setIsPopover(true);
            }

            toast.success('Credito registrado');
            setVisible(false);
            status && toast.error(status);
          } catch (error) {
            toast.error(HandleError(error as AxiosError));
          }

          actions.setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched }) => (
          <form onSubmit={handleSubmit}>
            <CardHeader title={'Crear nuevo credito'} />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <InputLabel id='demo-simple-select-outlined-label'>Tipo de credito</InputLabel>
                  <Select
                    labelId='demo-simple-select-outlined-label'
                    id='demo-simple-select-outlined'
                    error={Boolean(touched.tipo && errors.tipo)}
                    style={{ width: '100%' }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name='tipo'
                    label='Tipo de credito'
                  >
                    {['Auto', 'Bic'].map(item => (
                      <MenuItem value={item} key={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.monto && errors.monto)}
                    helperText={touched.monto && errors.monto}
                    fullWidth
                    name='monto'
                    required
                    label='Monto'
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Escriba el monto'}
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

      <Popover
        open={isPopover}
        onClose={() => setIsPopover(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography style={{ padding: 10 }}>
          Se registro el credito, ¿Deseas ver los credito de este cliente?
        </Typography>
        <Box display='flex' justifyContent='center'>
          <Button variant='outlined' onClick={CreditoByClientSection}>
            Si
          </Button>
          <Button variant='outlined' onClick={() => setVisible(false)}>
            No
          </Button>
        </Box>
      </Popover>
    </Card>
  );
};
