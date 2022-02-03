/* eslint-disable @typescript-eslint/no-use-before-define */
import { Grid, Typography, Box, Avatar, makeStyles } from '@material-ui/core';
import React, { ReactNode } from 'react';
import { SourceAvatar } from '../../../helpers/sourceAvatar';
import { NotificacionByMe } from '../../../interfaces/Notificacion';

interface Props {
  notificacion: NotificacionByMe;
  children: ReactNode;
}

const useStyles = makeStyles(theme => ({
  title: theme.typography.h3,
  head: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
  textCenter: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64,
  },
  btnSuccess: {
    backgroundColor: theme.palette.success.main,
  },
  btnDanger: {
    backgroundColor: theme.palette.error.main,
  },
}));

export const TemplateDefault = ({ notificacion, children }: Props) => {
  const classes = useStyles();

  return (
    <Grid container spacing={3} direction='row' justify='center' alignItems='center'>
      <Grid item xs={12} className={classes.head}>
        <Typography className={`${classes.title} ${classes.textCenter}`}>
          {notificacion.title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box alignItems='center' display='flex' flexDirection='column' p={2}>
          <Avatar className={classes.avatar} src={SourceAvatar(notificacion.sendDataUser.avatar)} />
          <Typography color='textPrimary' variant='h5'>
            {notificacion.sendDataUser.nombres} {notificacion.sendDataUser.apellidos}
          </Typography>
          <Typography color='textSecondary' variant='body2'>
            {notificacion.sendDataUser.idRol}
          </Typography>
        </Box>
        <Typography style={{ lineHeight: 2 }}>{notificacion.body}</Typography>
        <br />
        <Typography>
          <strong>Enviado el:</strong>{' '}
          <Typography color='textSecondary' component='span'>
            {notificacion.created_at}
          </Typography>
        </Typography>
      </Grid>
      <Grid item>{children}</Grid>
    </Grid>
  );
};
