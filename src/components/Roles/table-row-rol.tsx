/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  TableRow,
  TableCell,
  Checkbox,
  Switch,
  Button,
  makeStyles,
  CircularProgress,
} from '@material-ui/core';
import React, { useState, Dispatch, SetStateAction, useContext, useEffect } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Rol } from '../../interfaces/Rol';
import { UpdateActiveRol } from '../../api/roles';
import { MeContext } from '../../context/contextMe';
import { toast } from 'react-toast';
import { DialogoForm } from '../DialogoForm';
import { FormEditRol } from './edit-rol';

const useStyles = makeStyles((theme: any) => ({
  btnDelete: {
    backgroundColor: theme.palette.error.main,
  },
  btnEdit: {
    backgroundColor: theme.palette.warning.main,
  },
}));

interface Props {
  rol: Rol;
  IdsRole: string[];
  setIdRol: Dispatch<SetStateAction<string>>;
  setIdsRole: Dispatch<SetStateAction<string[]>>;
  setDialogoDelete: Dispatch<SetStateAction<boolean>>;
  setReloadRol: Dispatch<SetStateAction<boolean>>;
}

export const RowTableRol = ({
  rol,
  IdsRole,
  setIdRol,
  setIdsRole,
  setDialogoDelete,
  setReloadRol,
}: Props) => {
  const clases = useStyles();
  const { token } = useContext(MeContext);
  const [isActive, setIsActive] = useState<boolean>(rol.active ? true : false);
  const [DialogoEdit, setDialogoEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleActive = async (check: boolean) => {
    setLoading(true);

    try {
      await UpdateActiveRol({ token, active: check, IdRol: rol.idRol });
      setLoading(false);
      setIsActive(check);
    } catch (error) {
      setLoading(false);
      if (error.request.response) {
        toast.error(JSON.parse(error.request.response).status);
      } else {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    setDialogoEdit(false);
  }, []);

  const handleCheck = (check: boolean) => {
    if (check) {
      setIdsRole([...IdsRole, rol.idRol]);
    } else {
      const newIds = IdsRole.filter(id => id !== rol.idRol);
      setIdsRole([...newIds]);
    }
  };

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Checkbox
            checked={IdsRole.find(id => id === rol.idRol) ? true : false}
            onChange={check => handleCheck(check.target.checked)}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        </TableCell>
        <TableCell>{rol.rol}</TableCell>
        <TableCell>{rol.descripcion}</TableCell>
        <TableCell>{rol.created_at}</TableCell>
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
            title='Editar rol'
            className={clases.btnEdit}
            variant='contained'
            onClick={() => {
              setDialogoEdit(true);
              setIdRol(rol.idRol);
            }}
          >
            <EditIcon />
          </Button>
          &nbsp; &nbsp;
          <Button
            size='small'
            title='Eliminar rol'
            className={clases.btnDelete}
            variant='contained'
            onClick={() => {
              setDialogoDelete(true);
              setIdRol(rol.idRol);
            }}
          >
            <DeleteIcon />
          </Button>
        </TableCell>
      </TableRow>

      <DialogoForm Open={DialogoEdit} setOpen={setDialogoEdit} title=''>
        <FormEditRol IdRol={rol.idRol} descripcion={rol.descripcion} setReloadRol={setReloadRol} />
      </DialogoForm>
    </>
  );
};
