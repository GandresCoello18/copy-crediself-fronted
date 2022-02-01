/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { TableRow, TableCell, Switch, CircularProgress, Chip } from '@material-ui/core';
import React, { useState, useContext, SetStateAction, Dispatch } from 'react';
import { MeContext } from '../../context/contextMe';
import { toast } from 'react-toast';
import { AxiosError } from 'axios';
import { HandleError } from '../../helpers/handleError';
import { CreditoByCliente } from '../../interfaces/Credito';
import { UpdateActiveCredito } from '../../api/credito';

interface Props {
  credito: CreditoByCliente;
  setSelectCredito: Dispatch<SetStateAction<CreditoByCliente | undefined>>;
}

export const RowTableCredito = ({ credito, setSelectCredito }: Props) => {
  const { token } = useContext(MeContext);
  const [isActive, setIsActive] = useState<boolean>(credito.active ? true : false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleActive = async (check: boolean) => {
    setLoading(true);

    try {
      await UpdateActiveCredito({ token, active: check, IdCredito: credito?.idCredito || '' });
      setLoading(false);
      setIsActive(check);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  return (
    <>
      <TableRow hover onClick={() => setSelectCredito(credito)}>
        <TableCell>
          {credito.cliente.nombres} {credito.cliente.apellidos}
        </TableCell>
        <TableCell>{credito.tipo}</TableCell>
        <TableCell>${credito.monto}</TableCell>
        <TableCell>{`${credito.created_at}`.substr(0, 10)}</TableCell>
        <TableCell>
          <Chip color='secondary' label={credito.autorizado ? 'Si' : 'No'} />
        </TableCell>
        <TableCell>
          {loading ? (
            <CircularProgress color='secondary' />
          ) : (
            <Switch
              checked={isActive}
              onChange={value => handleActive(value.target.checked)}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          )}
        </TableCell>
      </TableRow>
    </>
  );
};
