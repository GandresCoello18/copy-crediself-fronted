/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { Table, TableBody, Box, TableCell, TableRow, Chip } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Permisos } from '../../interfaces/Permiso';

interface Props {
  permisos: Permisos[];
}

export const TablePermisos = ({ permisos }: Props) => {
  return (
    <PerfectScrollbar>
      <Box width={800}>
        <Table>
          <TableBody>
            {permisos.map(per => (
              <TableRow hover key={per.idPermiso}>
                <TableCell>{per.permiso}</TableCell>
                <TableCell>{per.descripcion}</TableCell>
                <TableCell>
                  <Chip
                    label={per.active ? 'Activo' : 'No Activo'}
                    color={per.active ? 'primary' : 'secondary'}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!permisos.length && (
          <Alert severity='info'>
            Por el momento no hay <strong>Permisos</strong> asignados.
          </Alert>
        )}
      </Box>
    </PerfectScrollbar>
  );
};
