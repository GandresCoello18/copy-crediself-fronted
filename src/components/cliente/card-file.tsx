/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { Paper } from '@material-ui/core';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import BackspaceIcon from '@material-ui/icons/Backspace';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import { BASE_API_IMAGES_CLOUDINNARY, BASE_API_IMAGES_CLOUDINNARY_SCALE } from '../../api';
import { Expediente } from '../../interfaces/Cliente';
import { DialogoMessage } from '../DialogoMessage';
import { AxiosError } from 'axios';
import { toast } from 'react-toast';
import { RemoveFileExpediente } from '../../api/expediente';
import { HandleError } from '../../helpers/handleError';

interface Props {
  file: Expediente;
  token: string;
  setReloadCliente: Dispatch<SetStateAction<boolean>>;
}

export const CardFile = ({ file, token, setReloadCliente }: Props) => {
  const [AceptDialog, setAceptDialog] = useState<boolean>(false);
  const [DialogoDelete, setDialogoDelete] = useState<boolean>(false);

  useEffect(() => {
    const FetchDelete = async () => {
      try {
        await RemoveFileExpediente({ token, idExpedienteClient: file.idExpedienteClient });
        toast.success('Archivo eliminado');

        setAceptDialog(false);
        setDialogoDelete(false);
        setReloadCliente(true);
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
      }
    };

    AceptDialog && FetchDelete();
  }, [AceptDialog, file, token]);

  return (
    <>
      <Paper>
        {file.kind === 'img' ? (
          <a
            target='_blank'
            rel='noreferrer'
            href={`${BASE_API_IMAGES_CLOUDINNARY}/${file.sourceExp}`}
          >
            <img
              src={`${BASE_API_IMAGES_CLOUDINNARY}/${file.sourceExp}`}
              alt={file.comprobanteExp}
              width='100%'
            />
          </a>
        ) : (
          <a
            target='_blank'
            rel='noreferrer'
            href={`${BASE_API_IMAGES_CLOUDINNARY_SCALE}/${file.sourceExp}`}
          >
            <PictureAsPdfIcon style={{ fontSize: 100 }} />
          </a>
        )}
        <h3 style={{ padding: 8, color: '#696969' }}>{file.comprobanteExp}</h3>
        <span title='Eliminar archivo' onClick={() => setDialogoDelete(true)}>
          <BackspaceIcon style={{ color: 'red', cursor: 'pointer' }} />
        </span>
      </Paper>

      <DialogoMessage
        title='Aviso importante'
        Open={DialogoDelete}
        setOpen={setDialogoDelete}
        setAceptDialog={setAceptDialog}
        content='¿Esta seguro que deseas eliminar este registro?, una vez hecho sera irrecuperable.'
      />
    </>
  );
};
