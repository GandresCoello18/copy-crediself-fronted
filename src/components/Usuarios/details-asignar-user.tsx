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
import React, { Dispatch, SetStateAction } from 'react';
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
  users: Asesores[] | Supervisor[];
  setVisible: Dispatch<SetStateAction<boolean>>;
  setReloadUser: Dispatch<SetStateAction<boolean>>;
}

export const DetailsAsignarUser = ({ users, setVisible, setReloadUser }: Props) => {
  const classes = useStyles();

  const HandleClickRemove = () => {
    setVisible(false);
    setReloadUser(true);
  };

  return (
    <Box p={2}>
      <List dense className={classes.root}>
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
                  onChange={event => console.log(event.target.value)}
                  checked={true}
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      <br />
      <Button
        onClick={HandleClickRemove}
        variant='outlined'
        fullWidth
        className={classes.btnRemove}
      >
        Remover
      </Button>
    </Box>
  );
};
