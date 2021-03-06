/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  Avatar,
  Box,
  Checkbox,
  List,
  ListItem,
  createStyles,
  makeStyles,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Button,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { AxiosError } from 'axios';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-toast';
import { UpdateNullAssignAsesores } from '../../api/users';
import { HandleError } from '../../helpers/handleError';
import { SourceAvatar } from '../../helpers/sourceAvatar';
import { Asesores, Supervisor } from '../../interfaces/Usuario';

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    btnRemove: {
      backgroundColor: theme.palette.error.main,
      color: '#000',
    },
  }),
);

interface Props {
  token: string;
  type: 'Supervisor' | 'Asesores' | undefined;
  users: Asesores[] | Supervisor[];
  setVisible: Dispatch<SetStateAction<boolean>>;
  setReloadUser: Dispatch<SetStateAction<boolean>>;
}

export const DetailsAsignarUser = ({ token, type, users, setVisible, setReloadUser }: Props) => {
  const classes = useStyles();
  const [idUsers, setIdUsers] = useState<string[]>([]);

  const HandleClickRemove = async () => {
    try {
      await UpdateNullAssignAsesores({ token, AsesoresId: idUsers });
      setVisible(false);
      setReloadUser(true);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
    }
  };

  const handleCheckbox = (idUser: string) => {
    if (idUsers.includes(idUser)) {
      const filterIds = idUsers.filter(id => id !== idUser);
      setIdUsers(filterIds);
    } else {
      setIdUsers([...idUsers, idUser]);
    }
  };

  return (
    <Box p={2}>
      <List dense className={classes.root}>
        {!users.length && (
          <Alert severity='info'>
            No hay <strong>usuarios</strong> para mostrar
          </Alert>
        )}
        {users.map(user => {
          const labelId = `checkbox-list-secondary-label-${user.idUser}`;
          return (
            <ListItem key={user.idUser} button>
              <ListItemAvatar>
                <Avatar alt={`${user.nombres} ${user.apellidos}`} src={SourceAvatar(user.avatar)} />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={`${user.nombres} ${user.apellidos}`} />
              <ListItemSecondaryAction>
                <Checkbox
                  edge='end'
                  disabled={type === 'Supervisor'}
                  onChange={() => handleCheckbox(user.idUser)}
                  checked={idUsers.includes(user.idUser)}
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      <br />
      {idUsers.length ? (
        <Button
          onClick={HandleClickRemove}
          variant='outlined'
          fullWidth
          className={classes.btnRemove}
        >
          Remover
        </Button>
      ) : (
        ''
      )}
    </Box>
  );
};
