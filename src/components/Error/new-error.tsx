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
import { HandleError } from '../../helpers/handleError';
import { UploadImage } from '../UploadImage';
import { ImageListType } from 'react-images-uploading';
import { NewErrorApp } from '../../api/errores';

interface Props {
  setReloadError: Dispatch<SetStateAction<boolean>>;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export const FormNewProblema = ({ setReloadError, setVisible }: Props) => {
  const { token } = useContext(MeContext);
  const [images, setImages] = useState<ImageListType>([]);

  const onChange = (imageList: ImageListType) => setImages(imageList as never[]);

  return (
    <Card>
      <Formik
        initialValues={{
          asunto: '',
          descripcion: '',
        }}
        validationSchema={Yup.object().shape({
          asunto: Yup.string().max(50).required('El campo es requerido'),
          descripcion: Yup.string().max(150).required('El campo es requerido'),
        })}
        onSubmit={async (values, actions) => {
          const data = new FormData();
          data.append('asunto', values.asunto);
          data.append('descripcion', values.descripcion);

          if (images.length) {
            data.append('captureError', images[0].file || '');
          }

          try {
            await NewErrorApp({ token, data });

            setReloadError(true);
            setVisible(false);
          } catch (error) {
            toast.error(HandleError(error as AxiosError));
          }

          actions.setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched }) => (
          <form onSubmit={handleSubmit}>
            <CardHeader title={'Registrar Problema'} />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.asunto && errors.asunto)}
                    helperText={touched.asunto && errors.asunto}
                    fullWidth
                    name='asunto'
                    required
                    label='Asunto'
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Escriba el asunto del problema'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(touched.descripcion && errors.descripcion)}
                    helperText={touched.descripcion && errors.descripcion}
                    fullWidth
                    name='descripcion'
                    multiline
                    required
                    label='Descripción'
                    onBlur={handleBlur}
                    rows={4}
                    disabled={isSubmitting}
                    variant='outlined'
                    onChange={handleChange}
                    placeholder={'Escriba alguna descripción o concepto del problema'}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <UploadImage images={images} maxNumber={1} onChange={onChange} />{' '}
                  <span>(Opcional)</span>
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
