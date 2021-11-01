/* eslint-disable @typescript-eslint/no-use-before-define */
import { Button, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
import { AxiosError } from 'axios';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { ImageListType } from 'react-images-uploading';
import { toast } from 'react-toast';
import { AddFileExpediente } from '../../api/expediente';
import { HandleError } from '../../helpers/handleError';
import { UploadImage } from '../UploadImage';

interface Props {
  token: string;
  idCliente: string;
  setReloadCliente: Dispatch<SetStateAction<boolean>>;
}

export const UploadExpediente = ({ token, idCliente, setReloadCliente }: Props) => {
  const [images, setImages] = useState<ImageListType>([]);
  const [IsUploadExp, setIsUploadExp] = useState<boolean>(false);
  const [Loading, setLoading] = useState<boolean>(false);
  const [ComprobanteExp, setComprobanteExp] = useState<string>('');

  const handleUploadExpediente = async () => {
    if (!IsUploadExp && !images.length) {
      setIsUploadExp(true);
      return;
    }

    if (!images.length) {
      toast.warn('Selecciona alguna comprobante de tu biblioteca');
      return;
    }

    if (!ComprobanteExp) {
      toast.warn('Selecciona el tipo de comprobante');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('idCliente', idCliente);
      data.append('comprobanteExp', ComprobanteExp);
      data.append('fileExpediente', images[0].file || '');

      await AddFileExpediente({ token, data });

      setLoading(false);
      setReloadCliente(true);
      setImages([]);
      setIsUploadExp(false);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  const CancelUploadExpediente = () => {
    setImages([]);
    setIsUploadExp(false);
  };

  const onChange = (imageList: ImageListType) => setImages(imageList as never[]);

  const renderSeelct = () => {
    return (
      <>
        <InputLabel id='demo-simple-select-label'>Tipo de Comprobante</InputLabel>
        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          style={{ width: '100%' }}
          onChange={event => setComprobanteExp(event.target.value as string)}
        >
          <MenuItem value='Factura Telefonica'>Factura Telefonica</MenuItem>
          <MenuItem value='Factura de gas'>Factura de Internet</MenuItem>
          <MenuItem value='Factura de energia'>Factura de Energia</MenuItem>
        </Select>
      </>
    );
  };

  return (
    <>
      {IsUploadExp ? (
        <>
          <UploadImage images={images} maxNumber={1} onChange={onChange} />

          <br />

          {images.length ? renderSeelct() : ''}

          <br />
        </>
      ) : (
        ''
      )}

      <br />

      <Grid container spacing={3}>
        <Grid item xs={12} md={IsUploadExp ? 6 : 12}>
          <Button
            variant='contained'
            disabled={Loading}
            onClick={handleUploadExpediente}
            color='primary'
            fullWidth
          >
            Agregar al expediente
          </Button>
        </Grid>
        {IsUploadExp && (
          <Grid item xs={12} md={IsUploadExp ? 6 : 12}>
            <Button
              variant='outlined'
              style={{ color: 'red', borderColor: 'red' }}
              onClick={CancelUploadExpediente}
              fullWidth
            >
              Cancelar
            </Button>
          </Grid>
        )}
      </Grid>
    </>
  );
};
