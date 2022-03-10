/* eslint-disable @typescript-eslint/no-use-before-define */
import { Avatar, Button, Chip, CircularProgress, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toast';
import { BASE_FRONTEND } from '../../api';
import { NewNoti, NewNotificacion } from '../../api/notificacion';
import { GetUserByRol } from '../../api/users';
import { Me } from '../../context/contextMe';
import { HandleError } from '../../helpers/handleError';
import { SourceAvatar } from '../../helpers/sourceAvatar';
import { Usuario } from '../../interfaces/Usuario';
import { DialogoForm } from '../DialogoForm';

interface Props {
  active?: boolean;
  idCliente: string;
  token: string;
  me: Me;
  clientRefNombres: string;
}

export const NotificationSupervisor = ({
  active,
  idCliente,
  token,
  me,
  clientRefNombres,
}: Props) => {
  const [LoadingNoti, setLoadingNoti] = useState<boolean>(false);
  const [LoadignUser, setLoadingUser] = useState<boolean>(false);
  const [SelectUser, setSelectUser] = useState<Usuario | undefined>(undefined);
  const [Visible, setVisible] = useState<boolean>(false);
  const [Users, setUsers] = useState<Usuario[]>([]);

  const FetchSupervisores = async () => {
    setLoadingUser(true);

    try {
      const { usuarios } = await (
        await GetUserByRol({ token, name: 'Supervisor', idSucursal: me.idSucursal })
      ).data;

      setUsers(usuarios);
      setLoadingUser(false);
      setVisible(true);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoadingUser(false);
    }
  };

  const handleDelete = () => {
    setSelectUser(undefined);
  };

  const sendNotification = async () => {
    setLoadingNoti(true);

    try {
      const notificacion: NewNoti = {
        sendingUser: me.idUser,
        receiptUser: SelectUser?.idUser || '',
        title: `${me.nombres.toUpperCase()} ${me.apellidos.toUpperCase()} te invita ha revisar los datos de un cliente.`,
        body: `Hola ${SelectUser?.nombres}, requiero que sea revisado los datos del cliente: ${clientRefNombres}.`,
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

  return (
    <>
      <Button
        variant='outlined'
        title='Notifica al supervisor para revición del cliente'
        onClick={FetchSupervisores}
        disabled={active || LoadignUser}
      >
        Notificar a supervisor
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
                  label='Supervisores'
                  disabled={LoadignUser}
                  variant='outlined'
                  placeholder={'Seleccione el supervisor'}
                />
              )}
            />

            <br />

            {SelectUser && (
              <>
                <Typography>
                  Notificar la autorización del cliente{' '}
                  <Chip
                    avatar={<Avatar alt={clientRefNombres} src={SourceAvatar('')} />}
                    label={clientRefNombres}
                  />{' '}
                  ha:{' '}
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
                  Enviar solicitud de a supervisor
                </Button>
              </>
            )}
          </>
        )}
      </DialogoForm>
    </>
  );
};
