/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { useState, useContext, useEffect, Dispatch, SetStateAction } from 'react';
import { Box, Table, TableBody, TableCell, Card, TableHead, TableRow } from '@material-ui/core';
import { MeContext } from '../../context/contextMe';
import Alert from '@material-ui/lab/Alert';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Skeleton from '@material-ui/lab/Skeleton';
import { DialogoMessage } from '../DialogoMessage';
import { toast } from 'react-toast';
import { HandleError } from '../../helpers/handleError';
import { AxiosError } from 'axios';
import { Usuario } from '../../interfaces/Usuario';
import { DeleteUser } from '../../api/users';
import { RowTableUser } from './row-table-user';

interface Props {
  usuarios: Usuario[];
  Loading: boolean;
  IdsUser: string[];
  setReloadUser: Dispatch<SetStateAction<boolean>>;
  setIdsUser: Dispatch<SetStateAction<string[]>>;
}

export const TableUser = ({ usuarios, Loading, IdsUser, setReloadUser, setIdsUser }: Props) => {
  const { token, me } = useContext(MeContext);
  const [IdUser, setIdUser] = useState<string>('');
  const [DialogoDelete, setDialogoDelete] = useState<boolean>(false);
  const [AceptDialog, setAceptDialog] = useState<boolean>(false);

  const SkeletonUser = () => {
    return [0, 1, 2, 3, 4, 5, 6, 7].map(item => (
      <Skeleton key={item} style={{ marginBottom: 10 }} variant='rect' width='100%' height={40} />
    ));
  };

  useEffect(() => {
    const FetchDelete = async () => {
      try {
        await DeleteUser({ token, IdUser });
        toast.success('Usuario eliminado');
        setReloadUser(true);

        setAceptDialog(false);
        setDialogoDelete(false);
        setIdUser('');
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
      }
    };

    AceptDialog && IdUser && FetchDelete();
  }, [AceptDialog, token, IdUser, setReloadUser]);

  useEffect(() => {
    if (!DialogoDelete) {
      setIdUser('');
    }
  }, [DialogoDelete]);

  return (
    <>
      <Card>
        <PerfectScrollbar>
          <Box minWidth={1050}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Check</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Nombres</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Apellidos</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Nombre de usuario</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Creado el</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Rol</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Activo</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Opciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!Loading &&
                  usuarios.map(user => (
                    <RowTableUser
                      user={user}
                      isMe={me.idUser === user.idUser}
                      key={user.idUser}
                      IdsUser={IdsUser}
                      setIdUser={setIdUser}
                      setIdsUser={setIdsUser}
                      setDialogoDelete={setDialogoDelete}
                    />
                  ))}
              </TableBody>
            </Table>

            {Loading && SkeletonUser()}

            {!Loading && usuarios.length === 0 && (
              <Alert severity='info'>
                Por el momento no hay <strong>Usuarios</strong> para mostrar.
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
