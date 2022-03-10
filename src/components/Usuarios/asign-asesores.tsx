/* eslint-disable @typescript-eslint/no-use-before-define */
import { CircularProgress, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { AxiosError } from 'axios';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'react-toast';
import { GetAsesoresDisponiblesUser } from '../../api/users';
import { HandleError } from '../../helpers/handleError';
import { Usuario } from '../../interfaces/Usuario';

interface Props {
  token: string;
  Asesores: Usuario[];
  IdSucursal: string;
  setAsesoresSelect: Dispatch<SetStateAction<Usuario[]>>;
}

export const AsignAsesores = ({ token, Asesores, IdSucursal, setAsesoresSelect }: Props) => {
  const [AsesoresData, setAsesores] = useState<Usuario[]>([]);
  const [Loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAsesores = async () => {
      setLoading(true);

      try {
        const { asesores } = await (
          await GetAsesoresDisponiblesUser({ token, idSucursal: IdSucursal })
        ).data;
        setAsesores(asesores);
        setLoading(false);
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
        setLoading(false);
      }
    };

    fetchAsesores();
  }, [token, IdSucursal]);

  return Loading ? (
    <>
      <CircularProgress color='primary' />
      <p>Obteniendo asesores, por favor espere.</p>
    </>
  ) : (
    <Autocomplete
      id='combo-box-demo'
      options={AsesoresData}
      getOptionLabel={option =>
        `${option.nombres} ${option.apellidos} ( ${option?.userName || 'Sin user name'} )`
      }
      getOptionSelected={(option, value) => {
        if (!Asesores.find(user => user.idUser === value.idUser)) {
          setAsesoresSelect([...Asesores, value]);
        }
        return true;
      }}
      style={{ width: '100%' }}
      renderInput={params => (
        <TextField
          {...params}
          fullWidth
          label='Asesor'
          variant='outlined'
          placeholder={'Seleccione un asesor'}
        />
      )}
    />
  );
};
