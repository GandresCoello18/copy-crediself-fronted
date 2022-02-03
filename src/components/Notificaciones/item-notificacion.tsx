/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import React, { Dispatch, SetStateAction } from 'react';
import { SourceAvatar } from '../../helpers/sourceAvatar';
import { NotificacionByMe } from '../../interfaces/Notificacion';

const useStyles = makeStyles((theme: any) => ({
  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
    fontSize: 16,
  },
  spaceBadge: {
    marginRight: 10,
    cursor: 'pointer',
  },
  iconNav: {
    borderRadius: 5,
    border: '1px solid #fff',
  },
  itemList: {
    width: 700,
    cursor: 'pointer',
  },
  itemListRead: {
    backgroundColor: '#f8f8f8',
  },
  itemListNotRead: {
    backgroundColor: '#e7e3e3',
  },
}));

interface Props {
  setOpen?: Dispatch<SetStateAction<boolean>>;
  setNotification?: Dispatch<SetStateAction<NotificacionByMe | undefined>>;
  notificacion: NotificacionByMe;
  handleItemRead?: (idNotification: string) => void;
}

export const ItemNotification = ({
  setOpen,
  setNotification,
  notificacion,
  handleItemRead,
}: Props) => {
  const classes = useStyles();

  return (
    <Link
      to={`/app/notificaciones?idNotificacion=${notificacion.idNotification}`}
      onClick={() => {
        setOpen && setOpen(false);
        setNotification && setNotification(notificacion);
        handleItemRead && handleItemRead(notificacion.idNotification);
      }}
    >
      <ListItem
        alignItems='flex-start'
        className={`${classes.itemList} ${
          notificacion.isRead === 0 ? classes.itemListNotRead : classes.itemListRead
        }`}
      >
        <ListItemAvatar>
          <Avatar
            alt={notificacion.sendDataUser.nombres}
            src={SourceAvatar(notificacion.sendDataUser.avatar)}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography color='textSecondary'>
              {notificacion.sendDataUser.nombres + ' ' + notificacion.sendDataUser.apellidos + ' '}
            </Typography>
          }
          secondary={
            <>
              <Typography
                component='span'
                variant='body2'
                className={classes.inline}
                color='textPrimary'
              >
                {' ' + notificacion.title + ', '}
              </Typography>
              {notificacion.body + ' '}
              <br />
              {'(' + notificacion.created_at + ')'}
            </>
          }
        />
      </ListItem>
    </Link>
  );
};
