/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  TableRow,
  TableCell,
  Switch,
  Button,
  makeStyles,
  CircularProgress,
} from '@material-ui/core';
import React, { useState, Dispatch, SetStateAction, useContext } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { MeContext } from '../../context/contextMe';
import { toast } from 'react-toast';
import { AxiosError } from 'axios';
import EditIcon from '@material-ui/icons/Edit';
import { HandleError } from '../../helpers/handleError';
import { Cliente } from '../../interfaces/Cliente';
import { UpdateActiveUser } from '../../api/users';

const useStyles = makeStyles((theme: any) => ({
  btnDelete: {
    backgroundColor: theme.palette.error.main,
  },
  btnEdit: {
    backgroundColor: theme.palette.warning.main,
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
}));

interface Props {
  cliente: Cliente;
  setIdCliente: Dispatch<SetStateAction<string>>;
  setDialogoDelete: Dispatch<SetStateAction<boolean>>;
  setDialogoUpdateClient: Dispatch<SetStateAction<boolean>>;
}

export const RowTableClient = ({
  cliente,
  setIdCliente,
  setDialogoDelete,
  setDialogoUpdateClient,
}: Props) => {
  const clases = useStyles();
  const { token } = useContext(MeContext);
  const [isActive, setIsActive] = useState<boolean>(cliente.active ? true : false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleActive = async (check: boolean) => {
    setLoading(true);

    try {
      await UpdateActiveUser({ token, active: check, IdUser: cliente.idCliente });
      setLoading(false);
      setIsActive(check);
    } catch (error) {
      setLoading(false);
      toast.error(HandleError(error as AxiosError));
    }
  };

  return (
    <>
      <TableRow hover>
        <TableCell>{cliente.nombres}</TableCell>
        <TableCell>{cliente.apellidos}</TableCell>
        <TableCell>{cliente.email || 'None'}</TableCell>
        <TableCell>{cliente.telefono}</TableCell>
        <TableCell>{cliente.sexo}</TableCell>
        <TableCell>{cliente.created_at}</TableCell>
        <TableCell>{cliente.ciudad}</TableCell>
        <TableCell>{cliente.direccion}</TableCell>
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
        <TableCell>
          <Button
            size='small'
            title='Editar Cliente'
            className={clases.btnEdit}
            variant='contained'
            onClick={() => {
              setDialogoUpdateClient(true);
              setIdCliente(cliente.idCliente);
            }}
          >
            <EditIcon />
          </Button>
          {'  '}
          <Button
            size='small'
            title='Eliminar Cliente'
            className={clases.btnDelete}
            variant='contained'
            onClick={() => {
              setDialogoDelete(true);
              setIdCliente(cliente.idCliente);
            }}
          >
            <DeleteIcon />
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};
