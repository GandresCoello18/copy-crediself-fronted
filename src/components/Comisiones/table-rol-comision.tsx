/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { TableRow, TableCell, Chip, Button } from '@material-ui/core';
import React from 'react';
import { MisComisiones } from '../../interfaces/Comision';

interface Props {
  handleReclamar: (comision: MisComisiones) => void;
  comision: MisComisiones;
}

export const RowTableComision = ({ handleReclamar, comision }: Props) => {
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
          {new Date().getTime() > new Date(comision.fechaHaPagar).getTime() &&
          comision.status === 'Pendiente' ? (
            <Button variant='outlined' color='secondary' onClick={() => handleReclamar(comision)}>
              Reclamar
            </Button>
          ) : null}
        </TableCell>
      </TableRow>
    </>
  );
};
