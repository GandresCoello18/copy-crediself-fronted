/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Grid, Typography, makeStyles, Badge, Avatar, Divider, Chip } from '@material-ui/core';
import React, { Dispatch, SetStateAction } from 'react';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { SourceAvatar } from '../../helpers/sourceAvatar';
import { Credito } from '../../interfaces/Credito';
import { Link as RouterLink } from 'react-router-dom';
import { Cliente } from '../../interfaces/Cliente';
import { LinearWithValueLabel } from '../LinearProgres';

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
    color: '#000',
  },
  backGroundHeadFalse: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
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
  credito: Credito;
  cliente: Cliente;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export const DetailsCreditoPago = ({ credito, cliente, setVisible }: Props) => {
  const clases = useStyles();

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          className={`${clases.headDetails} ${
            credito.autorizado && credito.active
              ? clases.backGroundHeadTrue
              : clases.backGroundHeadFalse
          }`}
        >
          <Box display='flex' justifyContent='space-between'>
            <Typography className={clases.title}>Credito #{credito?.numeroCredito}</Typography>
            <Badge className={clases.point} onClick={() => setVisible(false)}>
              <VisibilityOffIcon />
            </Badge>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box alignItems='center' display='flex' flexDirection='column' mb={2} p={2}>
            <Avatar
              className={clases.avatar}
              component={RouterLink}
              src={SourceAvatar('')}
              to={`/app/creditos/cliente/${cliente.idCliente}`}
            />
            <Typography color='textPrimary' variant='h5'>
              {cliente.nombres + ' ' + cliente.apellidos}
            </Typography>
            <Typography color='textSecondary' variant='body2'>
              {cliente.email}
            </Typography>

            <br />

            <LinearWithValueLabel progress={credito.progress || 0} />
          </Box>
        </Grid>

        <Divider />

        <Grid
          className={clases.rowSecondary}
          alignItems='center'
          container
          spacing={3}
          justify='space-between'
        >
          <Grid item>
            <strong>Tipo de credito:</strong>
          </Grid>
          <Grid item>{credito.tipo}</Grid>
        </Grid>

        <Grid
          className={`${clases.marginB} ${
            credito.autorizado && credito.active
              ? clases.backGroundHeadTrue
              : clases.backGroundHeadFalse
          }`}
          container
          spacing={3}
          alignItems='center'
          justify='space-between'
        >
          <Grid item>
            <strong>Monto:</strong>
          </Grid>
          <Grid item>${credito.monto}</Grid>
        </Grid>

        <Grid
          className={clases.rowSecondary}
          container
          spacing={3}
          alignItems='center'
          justify='space-between'
        >
          <Grid item>
            <strong>Cuota:</strong>
          </Grid>
          <Grid item>${credito.cuota}</Grid>
        </Grid>

        <Grid
          className={`${clases.marginB} ${
            credito.autorizado && credito.active
              ? clases.backGroundHeadTrue
              : clases.backGroundHeadFalse
          }`}
          container
          spacing={3}
          alignItems='center'
          justify='space-between'
        >
          <Grid item>
            <strong>Sucursal:</strong>
          </Grid>
          <Grid item>{credito.idSucursal}</Grid>
        </Grid>

        <Grid className={clases.rowSecondary} container spacing={3} justify='space-between'>
          <Grid item>
            <strong>Bono de apertura:</strong>
          </Grid>
          <Grid item>
            <Chip color='secondary' label={credito.apertura ? 'Si' : 'No'} />
          </Grid>
        </Grid>

        <Grid
          className={`${clases.marginB} ${
            credito.autorizado && credito.active
              ? clases.backGroundHeadTrue
              : clases.backGroundHeadFalse
          }`}
          container
          alignItems='center'
          spacing={3}
          justify='space-between'
        >
          <Grid item>
            <strong>Referencia:</strong>
          </Grid>
          <Grid item>{credito.referencia}</Grid>
        </Grid>

        <Grid
          className={clases.rowSecondary}
          alignItems='center'
          container
          spacing={3}
          justify='space-between'
        >
          <Grid item>
            <strong>Autorizado:</strong>
          </Grid>
          <Grid item>
            <Chip color='secondary' label={credito.autorizado ? 'Si' : 'No'} />
          </Grid>
        </Grid>

        <Grid
          className={`${clases.marginB} ${
            credito.autorizado && credito.active
              ? clases.backGroundHeadTrue
              : clases.backGroundHeadFalse
          }`}
          container
          spacing={3}
          alignItems='center'
          justify='space-between'
        >
          <Grid item>
            <strong>Credito numero:</strong>
          </Grid>
          <Grid item>#{credito.numeroCredito}</Grid>
        </Grid>

        <Grid
          className={clases.rowSecondary}
          container
          spacing={3}
          justify='space-between'
          alignItems='center'
        >
          <Grid item>
            <strong>Activo:</strong>
          </Grid>
          <Grid item>
            <Chip color='secondary' label={credito.active ? 'Si' : 'No'} />
          </Grid>
        </Grid>

        <Grid
          className={`${clases.marginB} ${
            credito.autorizado && credito.active
              ? clases.backGroundHeadTrue
              : clases.backGroundHeadFalse
          }`}
          container
          alignItems='center'
          spacing={3}
          justify='space-between'
        >
          <Grid item>
            <strong>Estado:</strong>
          </Grid>
          <Grid item>{credito.estado}</Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
