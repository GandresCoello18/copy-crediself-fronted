/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Grid, Typography, makeStyles, Badge, Chip, Avatar } from '@material-ui/core';
import React, { Dispatch, SetStateAction } from 'react';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { Pago } from '../../interfaces/Pago';
import { BASE_API_IMAGES_CLOUDINNARY_SCALE } from '../../api';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';
import { SourceAvatar } from '../../helpers/sourceAvatar';
import { Usuario } from '../../interfaces/Usuario';

const useStyles = makeStyles(theme => ({
  headDetails: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  backGroundHeadTrue: {
    backgroundColor: theme.palette.success.main,
  },
  backGroundHeadFalse: {
    backgroundColor: '#ffffff',
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64,
  },
  title: theme.typography.h4,
  point: {
    cursor: 'pointer',
  },
  rowSecondary: {
    backgroundColor: '#ebebeb',
    marginBottom: 10,
  },
  marginB: {
    marginBottom: 10,
  },
  titleContrato: {
    textAlign: 'center',
    fontSize: 25,
  },
}));

interface Props {
  pago: Pago;
  user: Usuario;
  setVisible?: Dispatch<SetStateAction<boolean>>;
}

export const DetailsPago = ({ pago, user, setVisible }: Props) => {
  const clases = useStyles();

  return (
    <Box p={2}>
      <Box alignItems='center' flexDirection='column' display='flex' mb={4}>
        <Avatar className={clases.avatar} src={SourceAvatar(user.avatar)} />
        <Typography color='textPrimary' variant='h5'>
          {user.nombres + ' ' + user.apellidos}
        </Typography>
        <Typography color='textSecondary' variant='body2'>
          {user.email}
        </Typography>
        <Chip
          style={{ marginTop: 10 }}
          avatar={<FaceIcon />}
          label={user.idRol}
          clickable
          color='default'
          deleteIcon={<DoneIcon />}
          variant='outlined'
        />
      </Box>
      <Grid container spacing={2}>
        <Grid
          className={`${clases.marginB} ${clases.rowSecondary}`}
          container
          spacing={3}
          alignItems='center'
          justify='space-between'
        >
          <Grid item>
            <Typography className={clases.title}>Detalles del Pago #{pago.numeroPago}</Typography>
          </Grid>
          <Grid item>
            <Badge className={clases.point} onClick={() => setVisible && setVisible(false)}>
              <VisibilityOffIcon />
            </Badge>
          </Grid>
        </Grid>

        <Grid
          className={`${clases.marginB} ${
            pago.aprobado ? clases.backGroundHeadTrue : clases.backGroundHeadFalse
          }`}
          container
          spacing={3}
          alignItems='center'
          justify='space-between'
        >
          <Grid item>
            <strong>Correspondiente al mes:</strong>
          </Grid>
          <Grid item>{pago.mes_correspondiente}</Grid>
        </Grid>

        <Grid
          className={clases.rowSecondary}
          container
          spacing={3}
          alignItems='center'
          justify='space-between'
        >
          <Grid item>
            <strong>Valor pagado:</strong>
          </Grid>
          <Grid item>${pago.valor}</Grid>
        </Grid>

        <Grid
          className={`${clases.marginB} ${
            pago.aprobado ? clases.backGroundHeadTrue : clases.backGroundHeadFalse
          }`}
          container
          spacing={3}
          alignItems='center'
          justify='space-between'
        >
          <Grid item>
            <strong>Tipo de pago:</strong>
          </Grid>
          <Grid item>{pago.tipo_de_pago}</Grid>
        </Grid>

        <Grid className={clases.rowSecondary} container spacing={3} justify='space-between'>
          <Grid item>
            <strong>Atrasado:</strong>
          </Grid>
          <Grid item>
            <Chip
              color={pago.atrasado ? 'secondary' : 'default'}
              label={pago.atrasado ? 'Si' : 'No'}
            />
          </Grid>
        </Grid>

        <Grid
          className={`${clases.marginB} ${
            pago.aprobado ? clases.backGroundHeadTrue : clases.backGroundHeadFalse
          }`}
          container
          alignItems='center'
          spacing={3}
          justify='space-between'
        >
          <Grid item>
            <strong>Aprobado:</strong>
          </Grid>
          <Grid item>
            <Chip
              color={pago.aprobado ? 'secondary' : 'default'}
              label={pago.aprobado ? 'Si' : 'No'}
            />
          </Grid>
        </Grid>

        <Grid
          className={clases.rowSecondary}
          alignItems='center'
          container
          spacing={3}
          justify='space-between'
        >
          <Grid item>
            <strong>Pagado el:</strong>
          </Grid>
          <Grid item>{pago.pagado_el}</Grid>
        </Grid>

        <Grid
          className={`${clases.marginB} ${
            pago.aprobado ? clases.backGroundHeadTrue : clases.backGroundHeadFalse
          }`}
          container
          spacing={3}
          alignItems='center'
          justify='space-between'
        >
          <Grid item>
            <strong>Registrado el:</strong>
          </Grid>
          <Grid item>{pago.created_at}</Grid>
        </Grid>

        <Grid
          className={clases.rowSecondary}
          container
          spacing={3}
          justify='space-between'
          alignItems='center'
        >
          <Grid item>
            <strong>Estado:</strong>
          </Grid>
          <Grid item>{pago.estado}</Grid>
        </Grid>

        <Grid
          className={`${clases.marginB} ${
            pago.aprobado ? clases.backGroundHeadTrue : clases.backGroundHeadFalse
          }`}
          container
          alignItems='center'
          spacing={3}
          justify='space-between'
        >
          <Grid item>
            <strong>Comprobante:</strong>
          </Grid>
          <Grid item>
            {pago.source ? (
              <img
                width='100%'
                alt='comprobante de pago'
                src={`${BASE_API_IMAGES_CLOUDINNARY_SCALE}/${pago.source}`}
              />
            ) : (
              'No hay comprobante'
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
