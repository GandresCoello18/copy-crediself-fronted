/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, TextField, Button } from '@material-ui/core';
import React, { Dispatch, SetStateAction } from 'react';

interface Props {
  handleSaveAcuerdo: () => void;
  setAcuerdo: Dispatch<SetStateAction<string>>;
}

export const RedaccionAcuerdo = ({ handleSaveAcuerdo, setAcuerdo }: Props) => {
  return (
    <Box p={4} alignItems='center' justifyContent='center'>
      <h3 style={{ textAlign: 'center' }}>Redacta el acuerdo para la cancelación del credito</h3>

      <br />

      <TextField
        id='outlined-multiline-static'
        label='Contenido del acuerdo'
        multiline
        fullWidth
        rows={10}
        placeholder='Por el presente acuerdo...'
        variant='outlined'
        onChange={event => setAcuerdo(event.target.value)}
      />

      <br />
      <br />

      <Button variant='outlined' onClick={handleSaveAcuerdo}>
        Terminar de redactar
      </Button>
    </Box>
  );
};
