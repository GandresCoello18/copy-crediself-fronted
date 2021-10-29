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
import { UpdatecheckGerenteSucCliente } from '../../api/clientes';
import { NewNoti, NewNotificacion } from '../../api/notificacion';
import { GetUserByRol } from '../../api/users';
import { Me } from '../../context/contextMe';
import { HandleError } from '../../helpers/handleError';
import { SourceAvatar } from '../../helpers/sourceAvatar';
import { Usuario } from '../../interfaces/Usuario';
import { DialogoForm } from '../DialogoForm';

interface Props {
  isCheckGerenteSuc: boolean;
  idCliente: string;
  token: string;
  me: Me;
  clientRefNombres: string;
  clientId: string;
  setReloadCliente: Dispatch<SetStateAction<boolean>>;
}

export const CheckGerenteSuc = ({
  isCheckGerenteSuc,
  idCliente,
  token,
  me,
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

  const HanldeUpdateCheck = async (isNotification: boolean) => {
    setLoading(true);
    const check = isCheckGerenteSuc ? false : true;

    try {
      await UpdatecheckGerenteSucCliente({ token, idCliente, check });
      setLoading(false);
      setReloadCliente(true);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }

    if (isNotification) {
      setVisible(true);
      FetchAdministrativo();
    }

    setVisibleQuestion(false);
  };

  const FetchAdministrativo = async () => {
    setLoadingUser(true);
    try {
      const { usuarios } = await (await GetUserByRol({ token, name: 'Administrativo' })).data;
      setUsers(usuarios);
      setLoadingUser(false);
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

  return (
    <>
      <Button
        variant='outlined'
        title='Marcar como revisado los documentos para comisiones'
        onClick={() => setVisibleQuestion(true)}
        disabled={isCheckGerenteSuc || Loading}
      >
        Revisión de documentación
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
