/* eslint-disable @typescript-eslint/no-use-before-define */
import { Avatar, Button, Chip, CircularProgress, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toast';
import { UpdateAutorizarCliente } from '../../api/clientes';
import { GetUserByRol } from '../../api/users';
import { HandleError } from '../../helpers/handleError';
import { SourceAvatar } from '../../helpers/sourceAvatar';
import { Usuario } from '../../interfaces/Usuario';
import { DialogoForm } from '../DialogoForm';

interface Props {
  rol: string;
  isAutorizado: boolean;
  idCliente: string;
  token: string;
  clientRefNombres: string;
}

export const AutorizarCliente = ({
  rol,
  isAutorizado,
  idCliente,
  token,
  clientRefNombres,
}: Props) => {
  const [Loading, setLoading] = useState<boolean>(false);
  const [LoadignUser, setLoadingUser] = useState<boolean>(false);
  const [SelectUser, setSelectUser] = useState<Usuario | undefined>(undefined);
  const [Visible, setVisible] = useState<boolean>(false);
  const [Users, setUsers] = useState<Usuario[]>([]);

  const handleAutorizar = async () => {
    if (rol !== 'Gerente de Sucursal') {
      setLoading(true);
      try {
        await UpdateAutorizarCliente({ token, idCliente, autorizar: !isAutorizado });
        setLoading(false);
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
        setLoading(false);
      }

      return;
    }

    setVisible(true);
    FetchGerenteSucursal();
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

  const handleDelete = () => {
    console.log('remove ' + SelectUser);
    setSelectUser(undefined);
  };

  return (
    <>
      <Button variant='outlined' onClick={handleAutorizar} disabled={isAutorizado || Loading}>
        Autorizar
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

                <Button variant='outlined' fullWidth>
                  Enviar solicitud de autorización
                </Button>
              </>
            )}
          </>
        )}
      </DialogoForm>
    </>
  );
};
