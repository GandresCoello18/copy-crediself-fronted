/* eslint-disable @typescript-eslint/no-use-before-define */
import { Paper, Box, createStyles, makeStyles, Button, CircularProgress } from '@material-ui/core';
import React, { useState, useContext } from 'react';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { BASE_API_FILE_DOCUMENT } from '../../api';
import { CreditoByContrato } from '../../interfaces/Credito';
import { AxiosError } from 'axios';
import { toast } from 'react-toast';
import { UpdateContratoByCredito } from '../../api/credito';
import { HandleError } from '../../helpers/handleError';
import { MeContext } from '../../context/contextMe';

interface Props {
  contrato: CreditoByContrato;
}

const useStyles = makeStyles(() =>
  createStyles({
    input: {
      display: 'none',
    },
  }),
);

export const ContratoCard = ({ contrato }: Props) => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [fileUpload, setFileUpload] = useState<FileList | null>(null);
  const [fileName, setFileName] = useState<string>(contrato.source);
  const [Loading, setLoading] = useState<boolean>(false);

  const handleFile = async () => {
    setLoading(true);

    const data = new FormData();
    if (!fileUpload) {
      toast.warn('Selecciona un archivo para actualizar');
      return;
    }

    data.append('contrato', fileUpload[0] || '');

    try {
      await UpdateContratoByCredito({
        token,
        idCreditoContrato: contrato.id_credito_contrato,
        data,
      });
      setLoading(false);
      toast.success('Se actualizo el contrato');
      setFileName(fileUpload[0].name);
      setFileUpload(null);
    } catch (error) {
      setLoading(false);
      toast.error(HandleError(error as AxiosError));
    }
  };

  return (
    <>
      <a
        target='_blank'
        rel='noreferrer'
        href={`${BASE_API_FILE_DOCUMENT}/doc/${fileName || contrato.source}`}
        key={contrato.id_credito_contrato}
      >
        <Paper elevation={3}>
          <Box p={1} textAlign='center'>
            <InsertDriveFileIcon style={{ fontSize: 40 }} />
            <br />
            <strong>Contrato: </strong>
            <span>{contrato.contrato}</span>
            <br />
            <strong>Actualizado el: </strong>
            <span>{contrato.updated_at}</span>
          </Box>
        </Paper>
      </a>

      {fileUpload ? (
        <Button fullWidth variant='contained' color='primary' onClick={handleFile} component='span'>
          {Loading ? <CircularProgress color='secondary' /> : `Subir: ${fileUpload[0].name}`}
        </Button>
      ) : (
        <>
          <input
            accept='.doc,.docx,.pdf'
            className={classes.input}
            id={`contrato-button-file-${contrato.idContrato}`}
            onChange={event => setFileUpload(event.target.files)}
            multiple
            type='file'
          />
          <label htmlFor={`contrato-button-file-${contrato.idContrato}`}>
            <Button fullWidth color='primary' component='span'>
              Actualizar
            </Button>
          </label>
        </>
      )}
    </>
  );
};
