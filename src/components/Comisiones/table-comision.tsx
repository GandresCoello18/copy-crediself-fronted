/* eslint-disable react/react-in-jsx-scope */
import { useState, useContext, Dispatch, SetStateAction } from 'react';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { UpdateComisionUserStatus } from '../../api/comisiones';
import { CurrentDate } from '../../helpers/fechas';
import { BASE_FRONTEND } from '../../api';

const useStyles = makeStyles(theme => ({
  headTable: {
    backgroundColor: theme.palette.primary.main,
  },
  textHeadTable: {
    color: '#fff',
  },
  btnMarcar: {
    color: theme.palette.warning.main,
  },
}));

interface Props {
  comision: MisComisiones[];
  setReload?: Dispatch<SetStateAction<boolean>>;
  Loading: boolean;
}

export const TableCoomision = ({ comision, setReload, Loading }: Props) => {
  const classes = useStyles();
  const { token, me } = useContext(MeContext);
  const [LoadignUser, setLoadingUser] = useState<boolean>(false);
  const [LoadignStatus, setLoadingStatus] = useState<boolean>(false);
  const [IdsComision, setIdsComision] = useState<string[]>([]);
  const [Dialogo, setDialogo] = useState<boolean>(false);
  const [DialogoAlert, setDialogoAlert] = useState<boolean>(false);
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
        link: `${BASE_FRONTEND}/app/comision-user/${MiComision?.idComisionUser}`,
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

  const handleCheck = (idComisionUser: string) => {
    const check = IdsComision.some(id => id === idComisionUser);

    if (!check) {
      setIdsComision([...IdsComision, idComisionUser]);
    } else {
      const newIds = IdsComision.filter(id => id !== idComisionUser);
      setIdsComision([...newIds]);
    }
  };

  const HandleStatus = async () => {
    setLoadingStatus(true);

    try {
      const { ComisCountEmpty, ComisCountRepeat, ComisCountDate } = await (
        await UpdateComisionUserStatus({ token, idsComisionUser: IdsComision, status: 'Pagado' })
      ).data;

      setLoadingStatus(false);
      setIdsComision([]);
      setMiComision(undefined);
      setReload && setReload(true);
      setDialogoAlert(false);

      if (ComisCountEmpty) {
        toast.warn(`${ComisCountEmpty} comisiones no fueron encontradas`);
      }

      if (ComisCountRepeat) {
        toast.warn(`${ComisCountRepeat} comisiones con el mismo estado`);
      }

      if (ComisCountDate) {
        toast.warn(`${ComisCountDate} comisiones con fecha de pago superior`);
      }
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoadingStatus(false);
    }
  };

  const handleValidDate = () => {
    const validDate = IdsComision.map(id => {
      const findComision = comision.find(com => com.idComisionUser === id);

      if (
        findComision &&
        new Date(findComision.fechaHaPagar).getTime() > new Date(CurrentDate()).getTime()
      ) {
        setMiComision(findComision);
        return true;
      }

      return null;
    });

    if (validDate.some(item => item === true)) {
      setDialogoAlert(true);
    } else {
      HandleStatus();
    }
  };

  const RenderOptions = (comision: MisComisiones) => {
    if (me.idRol === 'Administrativo') {
      const isCheck = IdsComision.some(id => id === comision.idComisionUser);
      const isProcess = isCheck && LoadignStatus;

      return (
        <Button
          title='Marcar esta comisión como pagado'
          variant={isCheck ? 'contained' : 'outlined'}
          disabled={isProcess || comision.status !== 'Pendiente'}
          color='secondary'
          onClick={() => handleCheck(comision.idComisionUser)}
        >
          {isProcess ? 'Marcando como pagado...' : 'Pagar'}
        </Button>
      );
    }

    const isTime = new Date().getTime() > new Date(comision.fechaHaPagar).getTime();
    if (isTime && comision.status === 'Pendiente') {
      return (
        <Button variant='outlined' color='secondary' onClick={() => FetchAdministrativo(comision)}>
          Reclamar
        </Button>
      );
    } else {
      return <Box></Box>;
    }
  };

  return (
    <>
      <Card>
        {IdsComision.length ? (
          <>
            <Button className={classes.btnMarcar} variant='outlined' onClick={handleValidDate}>
              Marcar como pagados las &nbsp; <strong>{IdsComision.length}</strong> &nbsp; comisiones
              seleccionadas
            </Button>
            <br />
            <br />
          </>
        ) : null}
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
                    <RowTableComision key={com.idComisionUser} comision={com}>
                      {RenderOptions(com)}
                    </RowTableComision>
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

      <Dialog
        open={DialogoAlert}
        onClose={() => setDialogoAlert(false)}
        keepMounted
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>!Aviso importante¡</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Se encontro comisiones con fecha de pago <strong>{MiComision?.fechaHaPagar}</strong> que
            es mayor a la fecha actual. ¿Esta seguro en continuar con esta acción?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={HandleStatus} color='secondary' variant='contained'>
            Continuar de todas formas
          </Button>
          <Button
            onClick={() => {
              setDialogoAlert(false);
              setMiComision(undefined);
            }}
            color='primary'
            variant='contained'
            autoFocus
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
