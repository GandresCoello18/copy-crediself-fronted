/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { TableRow, TableCell, Chip, Button } from '@material-ui/core';
import React from 'react';
import { MisComisiones } from '../../interfaces/Comision';

interface Props {
  comision: MisComisiones;
}

export const RowTableComision = ({ comision }: Props) => {
  return (
    <>
      <TableRow hover>
        <TableCell>
          {comision.user.nombres} {comision.user.apellidos}
        </TableCell>
        <TableCell>{comision.comisionType || <Chip color='primary' label='None' />}</TableCell>
        <TableCell>{comision.mesComision}</TableCell>
        <TableCell>{comision.porcentaje || 0}%</TableCell>
        <TableCell>{comision.fechaHaPagar}</TableCell>
        <TableCell>{comision.status}</TableCell>
        <TableCell>${comision.total}</TableCell>
        <TableCell>
          <Button variant='outlined' color='secondary'>
            Reclamar
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};
