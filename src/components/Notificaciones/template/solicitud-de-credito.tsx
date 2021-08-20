/* eslint-disable @typescript-eslint/no-use-before-define */
import { Avatar, Box, Button, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { SourceAvatar } from '../../../helpers/sourceAvatar';
import { NotificacionByMe } from '../../../interfaces/Notificacion';

interface Props {
  notifiacion: NotificacionByMe;
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
}));

export const SolicitudCredito = ({ notifiacion }: Props) => {
  const classes = useStyles();

  return (
    <Grid container spacing={3} direction='row' justify='center' alignItems='center'>
      <Grid item xs={12} className={classes.head}>
        <Typography className={`${classes.title} ${classes.textCenter}`}>
          {notifiacion.title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box alignItems='center' display='flex' flexDirection='column' p={2}>
          <Avatar className={classes.avatar} src={SourceAvatar(notifiacion.sendDataUser.avatar)} />
          <Typography color='textPrimary' variant='h5'>
            {notifiacion.sendDataUser.nombres} {notifiacion.sendDataUser.apellidos}
          </Typography>
          <Typography color='textSecondary' variant='body2'>
            {notifiacion.sendDataUser.idRol}
          </Typography>
        </Box>
        <Typography>{notifiacion.body}</Typography>
        <br />
        <Typography>
          Enviado el:{' '}
          <Typography color='textSecondary' component='span'>
            {notifiacion.created_at}
          </Typography>
        </Typography>
      </Grid>
      <Grid item xs={12} md={5}>
        <a href={notifiacion.link} target='_blanck'>
          <Button variant='contained' color='primary'>
            Cliente
          </Button>
        </a>
      </Grid>
      <Grid item xs={12} md={6}>
        <Button variant='contained' className={classes.btnSuccess}>
          Autorizar Credito
        </Button>
      </Grid>
    </Grid>
  );
};
