/* eslint-disable @typescript-eslint/no-use-before-define */
import { CircularProgress, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { AxiosError } from 'axios';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'react-toast';
import { GetSupervidoresUser } from '../../api/users';
import { HandleError } from '../../helpers/handleError';
import { Usuario } from '../../interfaces/Usuario';

interface Props {
  token: string;
  isSubmitting: boolean;
  setSupervisor: Dispatch<SetStateAction<Usuario | undefined>>;
}

export const SelectSupervisor = ({ token, isSubmitting, setSupervisor }: Props) => {
  const [Supervisores, setSupervisores] = useState<Usuario[]>([]);
  const [Loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSupervisores = async () => {
      setLoading(true);

      try {
        const { supervisores } = await (await GetSupervidoresUser({ token })).data;
        setSupervisores(supervisores);
        setLoading(false);
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
        setLoading(false);
      }
    };

    fetchSupervisores();
  }, [token]);

  return Loading ? (
    <>
      <CircularProgress color='primary' />
      <p>Obteniendo supervisores, por favor espere.</p>
    </>
  ) : (
    <Autocomplete
      id='combo-box-demo'
      options={Supervisores}
      getOptionLabel={option =>
        option.nombres + ' ' + option.apellidos + ' (' + option.userName + ') '
      }
      getOptionSelected={(option, value) => {
        setSupervisor(value);
        return true;
      }}
      style={{ width: '100%' }}
      renderInput={params => (
        <TextField
          {...params}
          fullWidth
          name='idSupervisor'
          required
          label='Supervisor'
          disabled={isSubmitting}
          variant='outlined'
          placeholder={'Seleccione un supervisor'}
        />
      )}
    />
  );
};
