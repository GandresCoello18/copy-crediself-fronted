/* eslint-disable @typescript-eslint/no-use-before-define */
import { Paper } from '@material-ui/core';
import React from 'react';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import { BASE_API_IMAGES_CLOUDINNARY, BASE_API_IMAGES_CLOUDINNARY_SCALE } from '../../api';
import { Expediente } from '../../interfaces/Cliente';

interface Props {
  file: Expediente;
}

export const CardFile = ({ file }: Props) => {
  return (
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
    </Paper>
  );
};
