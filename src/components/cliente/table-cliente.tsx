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
} from '@material-ui/core';
import { MeContext } from '../../context/contextMe';
import Alert from '@material-ui/lab/Alert';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Skeleton from '@material-ui/lab/Skeleton';
import { DialogoMessage } from '../DialogoMessage';
import { toast } from 'react-toast';
import { HandleError } from '../../helpers/handleError';
import { AxiosError } from 'axios';
import { Cliente } from '../../interfaces/Cliente';
import { DialogoForm } from '../DialogoForm';
import { DeleteCliente } from '../../api/clientes';
import { RowTableClient } from './row-table-client';
import { FormNewCredit } from './new-credit';
import { getPermisoExist } from '../../helpers/renderViewMainRol';

const useStyles = makeStyles((theme: any) => ({
  headTable: {
    backgroundColor: theme.palette.primary.main,
  },
  textHeadTable: {
    color: '#fff',
  },
}));

interface Props {
  clientes: Cliente[];
  Loading: boolean;
  setReloadCliente: Dispatch<SetStateAction<boolean>>;
}

export interface PermisoTableClient {
  newCredito: boolean;
}

export const TablaCliente = ({ clientes, Loading, setReloadCliente }: Props) => {
  const classes = useStyles();
  const { token, me } = useContext(MeContext);
  const [Permisos, setPermisos] = useState<PermisoTableClient>({
    newCredito: false,
  });
  const [IdCliente, setIdCliente] = useState<string>('');
  const [DialogoDelete, setDialogoDelete] = useState<boolean>(false);
  const [DialogoCredit, setDialogoCredit] = useState<boolean>(false);
  const [AceptDialog, setAceptDialog] = useState<boolean>(false);

  const SkeletonUser = () => {
    return [0, 1, 2, 3, 4, 5, 6, 7].map(item => (
      <Skeleton key={item} style={{ marginBottom: 10 }} variant='rect' width='100%' height={40} />
    ));
  };

  useEffect(() => {
    const FetchDelete = async () => {
      try {
        await DeleteCliente({ token, IdCliente });
        toast.success('Cliente eliminado');
        setReloadCliente(true);

        setAceptDialog(false);
        setDialogoDelete(false);
        setIdCliente('');
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
      }
    };

    AceptDialog && IdCliente && FetchDelete();

    setPermisos({
      newCredito: getPermisoExist({ RolName: me.idRol, permiso: 'NewCredito' }),
    });
  }, [AceptDialog, token, IdCliente, setReloadCliente]);

  useEffect(() => {
    if (!DialogoDelete) {
      setIdCliente('');
    }
  }, [DialogoDelete]);

  return (
    <>
      <Card>
        <PerfectScrollbar>
          <Box minWidth={1050}>
            <Table>
              <TableHead className={classes.headTable}>
                <TableRow>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Nombres</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Apellidos</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Telefono</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Sexo</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Creado el</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Ciudad</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Direccion</strong>
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
                  clientes.map(client => (
                    <RowTableClient
                      cliente={client}
                      permisos={Permisos}
                      key={client.idCliente}
                      setIdCliente={setIdCliente}
                      setDialogoDelete={setDialogoDelete}
                      setDialogoCredit={setDialogoCredit}
                    />
                  ))}
              </TableBody>
            </Table>

            {Loading && SkeletonUser()}

            {!Loading && clientes.length === 0 && (
              <Alert severity='info'>
                Por el momento no hay <strong>Clientes</strong> para mostrar.
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

      <DialogoForm Open={DialogoCredit} setOpen={setDialogoCredit} title=''>
        <FormNewCredit setVisible={setDialogoCredit} idCliente={IdCliente} />
      </DialogoForm>
    </>
  );
};
