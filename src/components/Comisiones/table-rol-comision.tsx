/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { TableRow, TableCell } from '@material-ui/core';
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
        <TableCell>{comision.comisionType}</TableCell>
        <TableCell>{comision.mesComision}</TableCell>
        <TableCell>{comision.porcentaje}%</TableCell>
        <TableCell>${comision.total}</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </>
  );
};
