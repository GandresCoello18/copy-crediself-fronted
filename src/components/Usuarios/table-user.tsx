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
  makeStyles,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Button,
} from '@material-ui/core';
import { MeContext } from '../../context/contextMe';
import Alert from '@material-ui/lab/Alert';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Skeleton from '@material-ui/lab/Skeleton';
import { DialogoMessage } from '../DialogoMessage';
import { toast } from 'react-toast';
import { HandleError } from '../../helpers/handleError';
import { AxiosError } from 'axios';
import { Supervisor, Usuario, UsuarioAsignacion } from '../../interfaces/Usuario';
import { AssignAsesores, DeleteUser } from '../../api/users';
import { RowTableUser } from './row-table-user';
import { getPermisoExist } from '../../helpers/renderViewMainRol';
import { DialogoForm } from '../DialogoForm';
import { FormUpdateRol } from './updateRol';
import { DetailsAsignarUser } from './details-asignar-user';
import { AsignAsesores } from './asign-asesores';
import { SourceAvatar } from '../../helpers/sourceAvatar';

const useStyles = makeStyles((theme: any) => ({
  headTable: {
    backgroundColor: theme.palette.primary.main,
  },
  textHeadTable: {
    color: '#fff',
  },
}));

interface Props {
  usuarios: UsuarioAsignacion[];
  Loading: boolean;
  IdsUser: string[];
  setReloadUser: Dispatch<SetStateAction<boolean>>;
  setIdsUser: Dispatch<SetStateAction<string[]>>;
}

export interface DisableInputUser {
  check: boolean;
  switch: boolean;
  delete: boolean;
  updateRol: boolean;
}

export interface AsignUsusario {
  data: Usuario[] | Supervisor[];
  type: 'Asesores' | 'Supervisor' | undefined;
}

export const TableUser = ({ usuarios, Loading, IdsUser, setReloadUser, setIdsUser }: Props) => {
  const classes = useStyles();
  const { token, me } = useContext(MeContext);
  const [IdUser, setIdUser] = useState<string>('');
  const [AsesoresSelect, setAsesoresSelect] = useState<Usuario[]>([]);
  const [disableInputUser] = useState<DisableInputUser>({
    check: getPermisoExist({ RolName: me.idRol, permiso: 'DelUsers' }),
    switch: getPermisoExist({ RolName: me.idRol, permiso: 'ModUsers' }),
    delete: getPermisoExist({ RolName: me.idRol, permiso: 'DelUsers' }),
    updateRol: getPermisoExist({ RolName: me.idRol, permiso: 'UpdateRolByUsers' }),
  });
  const [DialogoDelete, setDialogoDelete] = useState<boolean>(false);
  const [AsignUser, setAsignUser] = useState<AsignUsusario>({
    data: [],
    type: undefined,
  });
  const [DialogoUpdateRol, setDialogoUpdateRol] = useState<boolean>(false);
  const [DialogoAsignaUser, setDialogoAsignaUser] = useState<boolean>(false);
  const [DialogoAddAsesor, setDialogoAddAsesor] = useState<boolean>(false);
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

  const RemoveAsesorSelect = (idUser: string) => {
    const filterAsesor = AsesoresSelect.filter(user => user.idUser !== idUser);
    setAsesoresSelect(filterAsesor);
  };

  const handleAssignAsesores = async () => {
    try {
      const AsesoresId = AsesoresSelect.map(user => user.idUser);
      const Supervisor = usuarios.find(user => user.idUser === IdUser);

      if (!Supervisor) {
        toast.warn('Primero selecciona un supervisor para asignar los asesores');
        return;
      }

      if (Supervisor.idRol !== 'Supervisor') {
        toast.warn('El usuario seleccionado no es un supervisor');
        return;
      }

      await AssignAsesores({ token, Supervisor: Supervisor.idUser, AsesoresId });
      setDialogoAddAsesor(false);
      setReloadUser(true);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
    }
  };

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
                    <strong>Nombres</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Apellidos</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Usuario</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Sexo</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Creado el</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Rol</strong>
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
                  usuarios.map(user => (
                    <RowTableUser
                      user={user}
                      isMe={me.idUser === user.idUser}
                      key={user.idUser}
                      disabledInput={disableInputUser}
                      IdsUser={IdsUser}
                      setIdUser={setIdUser}
                      setIdsUser={setIdsUser}
                      setDialogoDelete={setDialogoDelete}
                      setDialogoUpdateRol={setDialogoUpdateRol}
                      setDialogoAsignaUser={setDialogoAsignaUser}
                      setAsignUser={setAsignUser}
                      setDialogoAddAsesor={setDialogoAddAsesor}
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

      <DialogoForm Open={DialogoUpdateRol} setOpen={setDialogoUpdateRol} title=''>
        <FormUpdateRol
          User={usuarios.find(user => user.idUser === IdUser)}
          setReloadUser={setReloadUser}
          setVisible={setDialogoUpdateRol}
        />
      </DialogoForm>

      <DialogoForm
        Open={DialogoAsignaUser}
        setOpen={setDialogoAsignaUser}
        title={AsignUser.type || ''}
      >
        <DetailsAsignarUser
          token={token}
          type={AsignUser.type}
          users={AsignUser.data}
          setReloadUser={setReloadUser}
          setVisible={setDialogoAsignaUser}
        />
      </DialogoForm>

      <DialogoForm
        Open={DialogoAddAsesor}
        setOpen={setDialogoAddAsesor}
        title='Asesores Disponibles'
      >
        <AsignAsesores
          token={token}
          Asesores={AsesoresSelect}
          setAsesoresSelect={setAsesoresSelect}
        />
        <br />
        {AsesoresSelect.map(user => (
          <Chip
            key={user.idUser}
            style={{ margin: 5 }}
            avatar={<Avatar alt='Natacha' src={SourceAvatar(user.avatar || '')} />}
            label={user.nombres}
            title={`${user.nombres} ${user.apellidos}`}
            onDelete={() => RemoveAsesorSelect(user.idUser)}
            variant='outlined'
          />
        ))}

        <Button
          disabled={!AsesoresSelect.length}
          onClick={handleAssignAsesores}
          style={{ marginTop: 10 }}
          fullWidth
          color='primary'
          variant='outlined'
        >
          Asignar Asesores a ({usuarios.find(user => user.idUser === IdUser)?.nombres})
        </Button>
      </DialogoForm>
    </>
  );
};
