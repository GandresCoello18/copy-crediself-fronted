/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  Avatar,
  Button,
  Chip,
  Box,
  CircularProgress,
  TextField,
  Typography,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { AxiosError } from 'axios';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-toast';
import { BASE_FRONTEND } from '../../api';
import { UpdatecheckSupervisorCliente } from '../../api/clientes';
import { NewNoti, NewNotificacion } from '../../api/notificacion';
import { GetUserByRol } from '../../api/users';
import { Me } from '../../context/contextMe';
import { HandleError } from '../../helpers/handleError';
import { SourceAvatar } from '../../helpers/sourceAvatar';
import { Usuario } from '../../interfaces/Usuario';
import { DialogoForm } from '../DialogoForm';

interface Props {
  disabled: boolean;
  isCheckSupervisor: boolean;
  idCliente: string;
  me: Me;
  token: string;
  clientRefNombres: string;
  setReloadCliente: Dispatch<SetStateAction<boolean>>;
}

export const CheckeSupervisor = ({
  disabled,
  isCheckSupervisor,
  idCliente,
  me,
  token,
  clientRefNombres,
  setReloadCliente,
}: Props) => {
  const [Loading, setLoading] = useState<boolean>(false);
  const [LoadingNoti, setLoadingNoti] = useState<boolean>(false);
  const [LoadignUser, setLoadingUser] = useState<boolean>(false);
  const [SelectUser, setSelectUser] = useState<Usuario | undefined>(undefined);
  const [Visible, setVisible] = useState<boolean>(false);
  const [VisibleQuestion, setVisibleQuestion] = useState<boolean>(false);
  const [Users, setUsers] = useState<Usuario[]>([]);

  const HanldeUpdateCheck = async (isNotificar: boolean) => {
    setLoading(true);
    const check = isCheckSupervisor ? false : true;

    try {
      await UpdatecheckSupervisorCliente({ token, check, idCliente });
      setLoading(false);
      setReloadCliente(true);
    } catch (error) {
      setLoading(false);
      toast.error(HandleError(error as AxiosError));
    }

    if (isNotificar) {
      FetchGerenteSucursal();
      setVisible(true);
    }

    setVisibleQuestion(false);
  };

  const FetchGerenteSucursal = async () => {
    setLoadingUser(true);
    try {
      const { usuarios } = await (await GetUserByRol({ token, name: 'Gerente de Sucursal' })).data;
      setUsers(usuarios);
      setLoadingUser(false);
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
        title: `${me.nombres.toUpperCase()} ${me.apellidos.toUpperCase()} te invita ha revisar la documentación de un cliente.`,
        body: `Hola ${SelectUser?.nombres}, requiero que sea revisado los documentos del cliente ${clientRefNombres}.`,
        link: `${BASE_FRONTEND}/app/clientes/${idCliente}`,
      };

      await NewNotificacion({ token, data: notificacion });
      setLoadingNoti(false);
      setVisible(false);
      toast.success(`Se envio una notificacion ha: ${SelectUser?.nombres}`);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoadingNoti(false);
    }
  };

  const handleDelete = () => {
    setSelectUser(undefined);
  };

  return (
    <>
      <Button
        disabled={disabled || Loading}
        title='Marcar como revisado los documentos y datos'
        variant='outlined'
        onClick={() => setVisibleQuestion(true)}
      >
        Validación de documentos y datos
      </Button>

      <DialogoForm Open={Visible} setOpen={setVisible} title='Selecciona el usuario a notificar'>
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
                  label='Gerentes de sucursal'
                  disabled={Loading}
                  variant='outlined'
                  placeholder={'Seleccione el gerente sucursal'}
                />
              )}
            />

            <br />

            {SelectUser && (
              <>
                <Typography>
                  <Chip
                    avatar={
                      <Avatar
                        alt={SelectUser.nombres}
                        src={SourceAvatar(SelectUser?.avatar || '')}
                      />
                    }
                    label={SelectUser?.nombres}
                    onDelete={handleDelete}
                  />
                </Typography>

                <br />

                <Button
                  onClick={sendNotification}
                  disabled={LoadingNoti}
                  variant='outlined'
                  fullWidth
                >
                  Enviar solicitud de autorización
                </Button>
              </>
            )}
          </>
        )}
      </DialogoForm>

      <DialogoForm
        Open={VisibleQuestion}
        setOpen={setVisibleQuestion}
        title='¿Quires notificar a un Gerente Sucursal?'
      >
        <Box p={3} display='flex' justifyContent='space-between'>
          <Button onClick={() => HanldeUpdateCheck(true)} variant='outlined' fullWidth>
            Si
          </Button>

          <Button onClick={() => HanldeUpdateCheck(false)} variant='outlined' fullWidth>
            No
          </Button>
        </Box>
      </DialogoForm>
    </>
  );
};
