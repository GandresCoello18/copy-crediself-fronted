/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { useState, useContext } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  Card,
  TableHead,
  makeStyles,
  TableRow,
  Avatar,
  Button,
  Chip,
  CircularProgress,
  TextField,
  Typography,
} from '@material-ui/core';
import { MeContext } from '../../context/contextMe';
import Alert from '@material-ui/lab/Alert';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Skeleton from '@material-ui/lab/Skeleton';
import { toast } from 'react-toast';
import { AxiosError } from 'axios';
import { HandleError } from '../../helpers/handleError';
import { MisComisiones } from '../../interfaces/Comision';
import { RowTableComision } from './table-rol-comision';
import { Autocomplete } from '@material-ui/lab';
import { SourceAvatar } from '../../helpers/sourceAvatar';
import { DialogoForm } from '../DialogoForm';
import { Usuario } from '../../interfaces/Usuario';
import { GetUserByRol } from '../../api/users';
import { NewNoti, NewNotificacion } from '../../api/notificacion';

const useStyles = makeStyles((theme: any) => ({
  headTable: {
    backgroundColor: theme.palette.primary.main,
  },
  textHeadTable: {
    color: '#fff',
  },
}));

interface Props {
  comision: MisComisiones[];
  Loading: boolean;
}

export const TableCoomision = ({ comision, Loading }: Props) => {
  const classes = useStyles();
  const { token, me } = useContext(MeContext);
  const [LoadignUser, setLoadingUser] = useState<boolean>(false);
  const [Dialogo, setDialogo] = useState<boolean>(false);
  const [LoadingNoti, setLoadingNoti] = useState<boolean>(false);
  const [SelectUser, setSelectUser] = useState<Usuario | undefined>(undefined);
  const [MiComision, setMiComision] = useState<MisComisiones | undefined>(undefined);
  const [Users, setUsers] = useState<Usuario[]>([]);

  const SkeletonRoles = () => {
    return [0, 1, 2, 3].map(item => (
      <Skeleton key={item} style={{ marginBottom: 10 }} variant='rect' width='100%' height={40} />
    ));
  };

  const FetchAdministrativo = async (comision: MisComisiones) => {
    setLoadingUser(true);
    try {
      const { usuarios } = await (await GetUserByRol({ token, name: 'Administrativo' })).data;
      setUsers(usuarios);
      setLoadingUser(false);

      if (usuarios.length) {
        setDialogo(true);
        setMiComision(comision);
      } else {
        toast.warn('No se encontraron usuarios');
      }
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoadingUser(false);
    }
  };

  const sendNotification = async () => {
    setLoadingNoti(true);

    try {
      const notificacion: NewNoti = {
        sendingUser: me.idUser,
        receiptUser: SelectUser?.idUser || '',
        title: `${me.nombres.toUpperCase()} ${me.apellidos.toUpperCase()} presenta reclamo en pago de comisiones.`,
        body: `Hola ${SelectUser?.nombres}, soy ${
          me?.nombres
        } y requiero que sea revisado el pago de comision en estado: ${MiComision?.status.toUpperCase()} con fecha limite de: ${
          MiComision?.fechaHaPagar
        } con un total de $${MiComision?.total} .`,
        link: null,
      };

      await NewNotificacion({ token, data: notificacion });
      setLoadingNoti(false);
      setDialogo(false);
      toast.success(`Se envio una notificacion ha: ${SelectUser?.nombres}`);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoadingNoti(false);
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
                  <TableCell title='usuario beneficiario' className={classes.textHeadTable}>
                    <strong>Usuario</strong>
                  </TableCell>
                  <TableCell title='tipo de comision' className={classes.textHeadTable}>
                    <strong>Tipo Com</strong>
                  </TableCell>
                  <TableCell title='fecha que se registro' className={classes.textHeadTable}>
                    <strong>Fecha</strong>
                  </TableCell>
                  <TableCell title='porcentaje en el calculo' className={classes.textHeadTable}>
                    <strong>Porcent %</strong>
                  </TableCell>
                  <TableCell title='fecha aproximada de paga' className={classes.textHeadTable}>
                    <strong>Fecha ha pagar</strong>
                  </TableCell>
                  <TableCell title='estado de la comision o bono' className={classes.textHeadTable}>
                    <strong>Estado</strong>
                  </TableCell>
                  <TableCell title='total a pagar' className={classes.textHeadTable}>
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell title='opciones' className={classes.textHeadTable}>
                    <strong>Opciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!Loading &&
                  comision.map(com => (
                    <RowTableComision
                      handleReclamar={FetchAdministrativo}
                      key={com.idComisionUser}
                      comision={com}
                    />
                  ))}
              </TableBody>
            </Table>

            {Loading && SkeletonRoles()}

            {!Loading && comision.length === 0 && (
              <Alert severity='info'>
                Por el momento no hay <strong>Comisiones</strong> para mostrar.
              </Alert>
            )}
          </Box>
        </PerfectScrollbar>
      </Card>

      <DialogoForm Open={Dialogo} setOpen={setDialogo} title='Selecciona el admin a notificar'>
        {LoadignUser ? (
          <CircularProgress color='secondary' />
        ) : (
          <>
            <Autocomplete
              id='combo-box-demo'
              options={Users}
              getOptionLabel={option => option.nombres + ' ' + option.apellidos}
              getOptionSelected={(option, value) => {
                if (SelectUser === undefined) {
                  setSelectUser(value);
                }
                return true;
              }}
              style={{ width: '100%' }}
              renderInput={params => (
                <TextField
                  {...params}
                  fullWidth
                  label='Administradores'
                  disabled={Loading}
                  variant='outlined'
                  placeholder={'Seleccione el administrador'}
                />
              )}
            />

            <br />

            {SelectUser && (
              <>
                <Typography>
                  Notificar ha:{' '}
                  <Chip
                    avatar={
                      <Avatar
                        alt={SelectUser.nombres}
                        src={SourceAvatar(SelectUser?.avatar || '')}
                      />
                    }
                    label={SelectUser?.nombres}
                    onDelete={() => setSelectUser(undefined)}
                  />
                </Typography>

                <br />

                <Button
                  onClick={sendNotification}
                  disabled={LoadingNoti}
                  variant='outlined'
                  fullWidth
                >
                  Enviar
                </Button>
              </>
            )}
          </>
        )}
      </DialogoForm>
    </>
  );
};
