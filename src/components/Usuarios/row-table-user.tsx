/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  TableRow,
  TableCell,
  Checkbox,
  Avatar,
  Switch,
  Box,
  Typography,
  Button,
  makeStyles,
  CircularProgress,
} from '@material-ui/core';
import React, { useState, Dispatch, SetStateAction, useContext } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { UpdateActiveRol } from '../../api/roles';
import { MeContext } from '../../context/contextMe';
import { toast } from 'react-toast';
import { AxiosError } from 'axios';
import { HandleError } from '../../helpers/handleError';
import { Usuario } from '../../interfaces/Usuario';
import getInitials from '../../util/getInitials';
import { SourceAvatar } from '../../helpers/sourceAvatar';

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
  user: Usuario;
  isMe: boolean;
  IdsUser: string[];
  setIdUser: Dispatch<SetStateAction<string>>;
  setIdsUser: Dispatch<SetStateAction<string[]>>;
  setDialogoDelete: Dispatch<SetStateAction<boolean>>;
}

export const RowTableUser = ({
  user,
  isMe,
  IdsUser,
  setIdUser,
  setIdsUser,
  setDialogoDelete,
}: Props) => {
  const clases = useStyles();
  const { token } = useContext(MeContext);
  const [isActive, setIsActive] = useState<boolean>(user.active ? true : false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleActive = async (check: boolean) => {
    setLoading(true);

    try {
      await UpdateActiveRol({ token, active: check, IdRol: user.idUser });
      setLoading(false);
      setIsActive(check);
    } catch (error) {
      setLoading(false);
      toast.error(HandleError(error as AxiosError));
    }
  };

  const handleCheck = (check: boolean) => {
    if (check) {
      setIdsUser([...IdsUser, user.idUser]);
    } else {
      const newIds = IdsUser.filter(id => id !== user.idUser);
      setIdsUser([...newIds]);
    }
  };

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Checkbox
            checked={IdsUser.find(id => id === user.idUser) ? true : false}
            onChange={check => handleCheck(check.target.checked)}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        </TableCell>
        <TableCell>
          <Box alignItems='center' display='flex'>
            <Avatar className={clases.avatar} src={SourceAvatar(user.avatar)}>
              {getInitials(user.nombres)}
            </Avatar>
            <Typography color='textPrimary' variant='body1'>
              {user.nombres}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>{user.apellidos}</TableCell>
        <TableCell>{user.userName || 'None'}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.created_at}</TableCell>
        <TableCell>{user.idRol}</TableCell>
        <TableCell>
          {!isMe ? (
            loading ? (
              <CircularProgress color='secondary' />
            ) : (
              <Switch
                checked={isActive}
                onChange={value => handleActive(value.target.checked)}
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            )
          ) : (
            ''
          )}
        </TableCell>
        <TableCell>
          {!isMe ? (
            <Button
              size='small'
              title='Eliminar rol'
              className={clases.btnDelete}
              variant='contained'
              onClick={() => {
                setDialogoDelete(true);
                setIdUser(user.idUser);
              }}
            >
              <DeleteIcon />
            </Button>
          ) : (
            ''
          )}
        </TableCell>
      </TableRow>
    </>
  );
};
