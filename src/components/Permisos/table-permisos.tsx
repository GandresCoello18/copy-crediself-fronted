/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import {
  Table,
  TableBody,
  Box,
  TableCell,
  TableRow,
  Switch,
  CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { AxiosError } from 'axios';
import React, { useState, useContext } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { toast } from 'react-toast';
import { UpdateActivePermisoByRol } from '../../api/permisos';
import { MeContext } from '../../context/contextMe';
import { HandleError } from '../../helpers/handleError';
import { PermisosResponseByRol } from '../../interfaces/Permiso';

interface Props {
  permisos: PermisosResponseByRol[];
}

export const TablePermisos = ({ permisos }: Props) => {
  const { token } = useContext(MeContext);
  const [Loading, setLoading] = useState<boolean>(false);
  const [IsActive, setIsActive] = useState<{ check: boolean; idPermisoRol: string | undefined }>({
    check: false,
    idPermisoRol: undefined,
  });

  const handleActive = async (check: boolean, idPermisoRol: string) => {
    setLoading(true);

    try {
      await UpdateActivePermisoByRol({ token, active: check, idPermisoRol });
      setLoading(false);
      setIsActive({ check, idPermisoRol });
    } catch (error) {
      setLoading(false);
      toast.error(HandleError(error as AxiosError));
    }
  };

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
                  {Loading ? (
                    <CircularProgress color='secondary' />
                  ) : (
                    <Switch
                      checked={
                        IsActive.idPermisoRol === per.idPermisoRol
                          ? IsActive.check
                          : per.activePBR
                          ? true
                          : false
                      }
                      disabled={per.permiso === 'UpdatePermisos'}
                      onChange={value => handleActive(value.target.checked, per.idPermisoRol)}
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  )}
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
