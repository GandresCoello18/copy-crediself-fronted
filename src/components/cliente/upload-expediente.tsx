/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  makeStyles,
  Box,
  createStyles,
  Select,
} from '@material-ui/core';
import { AxiosError } from 'axios';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { ImageListType } from 'react-images-uploading';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { toast } from 'react-toast';
import { AddFileExpediente, AddFileExpedienteDoc } from '../../api/expediente';
import { HandleError } from '../../helpers/handleError';
import { DialogoForm } from '../DialogoForm';
import { UploadImage } from '../UploadImage';
import { bytesToSize } from '../../helpers/file';

interface Props {
  token: string;
  idCliente: string;
  setReloadCliente: Dispatch<SetStateAction<boolean>>;
}

const useStyles = makeStyles(theme =>
  createStyles({
    input: {
      display: 'none',
    },
    textCard: {
      fontSize: 18,
      width: '100%',
      marginBottom: 10,
    },
    fileUpload: {
      textAlign: 'center',
      border: '1px solid #cdcdcd',
      padding: 10,
      borderRadius: 6,
      boxShadow: theme.shadows[5],
    },
  }),
);

export const UploadExpediente = ({ token, idCliente, setReloadCliente }: Props) => {
  const classes = useStyles();
  const [images, setImages] = useState<ImageListType>([]);
  const [fileUpload, setFileUpload] = useState<FileList | null>(null);
  const [IsUploadExp, setIsUploadExp] = useState<'img' | 'doc' | undefined>(undefined);
  const [Loading, setLoading] = useState<boolean>(false);
  const [Visible, setVisible] = useState<boolean>(false);
  const [ComprobanteExp, setComprobanteExp] = useState<string>('');

  const handleUploadExpediente = async () => {
    if (!IsUploadExp) {
      setVisible(true);
      return;
    }

    if (!images.length && IsUploadExp === 'img') {
      toast.warn('Selecciona alguna comprobante de tu biblioteca');
      return;
    }

    if (!fileUpload?.length && IsUploadExp === 'doc') {
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

      if (images.length) {
        data.append('fileExpediente', images[0].file || '');
        await AddFileExpediente({ token, data });
      }

      if (fileUpload) {
        data.append('fileExpediente', fileUpload[0] || '');
        await AddFileExpedienteDoc({ token, data });
      }

      setLoading(false);
      setReloadCliente(true);
      setImages([]);
      setFileUpload(null);
      setIsUploadExp(undefined);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  const CancelUploadExpediente = () => {
    setImages([]);
    setFileUpload(null);
    setIsUploadExp(undefined);
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
          <MenuItem value='Factura de Internet'>Factura de Internet</MenuItem>
          <MenuItem value='Factura de Energia'>Factura de Energia</MenuItem>
        </Select>

        <br />
      </>
    );
  };

  const renderIconFileUpload = (type: string) => {
    if (type.includes('pdf')) {
      return <PictureAsPdfIcon style={{ fontSize: 60 }} />;
    }

    return <FileCopyIcon style={{ fontSize: 60 }} />;
  };

  return (
    <>
      {IsUploadExp === 'img' ? (
        <>
          <UploadImage images={images} maxNumber={1} onChange={onChange} />
          <br />
        </>
      ) : (
        ''
      )}

      {IsUploadExp === 'doc' ? (
        <>
          <input
            accept='.doc,.docx,.pdf'
            className={classes.input}
            id='upload-expediente-doc'
            onChange={event => setFileUpload(event.target.files)}
            type='file'
          />
          <label htmlFor='upload-expediente-doc'>
            <Button fullWidth color='primary' component='span'>
              Seleccionar archivo
            </Button>
          </label>

          <br />

          {fileUpload?.length ? (
            <Box justifyContent='center' alignItems='center' display='flex' p={3}>
              <div className={classes.fileUpload}>
                {renderIconFileUpload(fileUpload[0].type)}
                <br />
                <strong>
                  {fileUpload[0].name}
                  <br />
                  {bytesToSize(fileUpload[0].size)}
                </strong>
              </div>
            </Box>
          ) : null}
        </>
      ) : (
        ''
      )}

      {images.length || fileUpload?.length ? renderSeelct() : ''}

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

      <DialogoForm
        Open={Visible}
        setOpen={setVisible}
        title='Seleccione el typo de archivo ha subir'
      >
        <FormControl variant='outlined' style={{ width: '100%' }}>
          <Select
            onChange={(event: any) => {
              setIsUploadExp(event.target.value);
              setVisible(false);
            }}
            style={{ width: '100%' }}
            label='Age'
          >
            <MenuItem value='img'>Imagen</MenuItem>
            <MenuItem value='doc'>Documento</MenuItem>
          </Select>
        </FormControl>
      </DialogoForm>
    </>
  );
};
