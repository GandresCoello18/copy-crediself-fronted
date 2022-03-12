/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { useState, useContext, useEffect, Dispatch, SetStateAction } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  Card,
  TableHead,
  makeStyles,
  TableRow,
} from '@material-ui/core';
import { MeContext } from '../../context/contextMe';
import Alert from '@material-ui/lab/Alert';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Skeleton from '@material-ui/lab/Skeleton';
import { DialogoMessage } from '../DialogoMessage';
import { toast } from 'react-toast';
import { Rol } from '../../interfaces/Rol';
import { RowTableRol } from './table-row-rol';
import { DeleteRole } from '../../api/roles';
import { AxiosError } from 'axios';
import { HandleError } from '../../helpers/handleError';

const useStyles = makeStyles((theme: any) => ({
  headTable: {
    backgroundColor: theme.palette.primary.main,
  },
  textHeadTable: {
    color: '#fff',
  },
}));

interface Props {
  roles: Rol[];
  Loading: boolean;
  SearchRoles: string;
  IdsRole: string[];
  setReloadRol: Dispatch<SetStateAction<boolean>>;
  setIdsRole: Dispatch<SetStateAction<string[]>>;
}

export const TableRol = ({
  roles,
  Loading,
  IdsRole,
  SearchRoles,
  setReloadRol,
  setIdsRole,
}: Props) => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [IdRol, setIdRol] = useState<string>('');
  const [DialogoDelete, setDialogoDelete] = useState<boolean>(false);
  const [AceptDialog, setAceptDialog] = useState<boolean>(false);

  const SkeletonRoles = () => {
    return [0, 1, 2, 3, 4, 5, 6, 7].map(item => (
      <Skeleton key={item} style={{ marginBottom: 10 }} variant='rect' width='100%' height={40} />
    ));
  };

  const FetchDelete = async () => {
    try {
      await DeleteRole({ token, IdRol });
      toast.success('Rol eliminado');
      setReloadRol(true);

      setAceptDialog(false);
      setDialogoDelete(false);
      setIdRol('');
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
    }
  };

  useEffect(() => {
    AceptDialog && IdRol && FetchDelete();
  }, [AceptDialog, IdRol]);

  return (
    <>
      <Card>
        <PerfectScrollbar>
          <Box minWidth={1050}>
            <Table>
              <TableHead className={classes.headTable}>
                <TableRow>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Check</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Rol</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Descripcion</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Creado el</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Activo</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Opciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!Loading &&
                  roles
                    .filter(rol => rol.rol.toUpperCase().includes(SearchRoles.toUpperCase()))
                    .map(rol => (
                      <RowTableRol
                        rol={rol}
                        key={rol.idRol}
                        IdsRole={IdsRole}
                        setIdRol={setIdRol}
                        setIdsRole={setIdsRole}
                        setDialogoDelete={setDialogoDelete}
                        setReloadRol={setReloadRol}
                      />
                    ))}
              </TableBody>
            </Table>

            {Loading && SkeletonRoles()}

            {!Loading && roles.length === 0 && (
              <Alert severity='info'>
                Por el momento no hay <strong>Roles</strong> para mostrar.
              </Alert>
            )}
          </Box>
        </PerfectScrollbar>
      </Card>

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
