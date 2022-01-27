/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Typography,
  AccordionSummary,
  Box,
  Grid,
  AccordionDetails,
  Accordion,
  Avatar,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CancelacionByDetails } from '../../interfaces/Cancelacion';
import { SourceAvatar } from '../../helpers/sourceAvatar';
import { ContratoCard } from '../Creditos/conntrato-card';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    headContante: {
      backgroundColor: theme.palette.success.main,
      color: '#696969',
    },
    avatar: {
      height: 40,
      width: 40,
    },
  }),
);

interface Props {
  cancelacion: CancelacionByDetails;
}

export const ItemCreditoCancelado = ({ cancelacion }: Props) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState<string>('');

  const handleChange = (panel: string) => (_: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : '');
  };

  const RenderContent = (options: { field: string; value: string | number }) => {
    return (
      <Box borderTop={1} borderColor='success.main' p={2}>
        <Grid spacing={3} container justify='space-between'>
          <Grid item>{options.field}:</Grid>
          <Grid item>{options.value}</Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Accordion
      expanded={expanded === cancelacion.idCancelacion}
      onChange={handleChange(cancelacion.idCancelacion)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1bh-content'
        id='panel1bh-header'
      >
        <Typography className={classes.heading}>
          {cancelacion.cliente.nombres} {cancelacion.cliente.apellidos}
        </Typography>
        <Typography className={classes.secondaryHeading}>
          {cancelacion.credito.tipo} ( {cancelacion.created_at} )
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid spacing={3} container justify='center'>
          <Grid item xs={12} md={4}>
            <Box p={2} className={classes.headContante}>
              <h4>Información del cliente</h4>
            </Box>
            {RenderContent({ field: 'Nombres', value: cancelacion.cliente.nombres })}
            {RenderContent({ field: 'Apellidos', value: cancelacion.cliente.apellidos })}
            {RenderContent({ field: 'Email', value: cancelacion.cliente.email || '(NONE)' })}
            {RenderContent({ field: 'Telefono', value: cancelacion.cliente.telefono || '(NONE)' })}
            {RenderContent({ field: 'Ciudad', value: cancelacion.cliente.ciudad || '(NONE)' })}
            {RenderContent({ field: 'Sexo', value: cancelacion.cliente.sexo })}
          </Grid>
          <Grid item xs={12} md={4}>
            <Box p={2} className={classes.headContante}>
              <h4>Información del credito</h4>
            </Box>
            {RenderContent({ field: 'Tipo', value: cancelacion.credito.tipo })}
            {RenderContent({ field: 'Monto', value: `$${cancelacion.credito.monto}` })}
            {RenderContent({ field: 'Estado', value: cancelacion.credito.estado })}
            {RenderContent({ field: 'Numero', value: `#${cancelacion.credito.numeroCredito}` })}
            <Box borderTop={1} borderColor='success.main' p={2}>
              <Grid spacing={3} container justify='space-between'>
                <Grid item>Cancelación solicitada por:</Grid>
                <Grid item>
                  <Box display='flex' alignItems='center' flexDirection='row'>
                    <span>
                      {cancelacion.user.nombres} {cancelacion.user.apellidos}
                    </span>
                    &nbsp; &nbsp;
                    <Avatar
                      className={classes.avatar}
                      src={SourceAvatar(cancelacion.user.avatar)}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
            {RenderContent({ field: 'Rol', value: cancelacion.user.idRol })}
          </Grid>
          <Grid item xs={12} md={4}>
            <Box p={2} className={classes.headContante}>
              <h4>Información de contratos</h4>
            </Box>

            {cancelacion.contratos.map(contrato => (
              <ContratoCard key={contrato.id_credito_contrato} contrato={contrato} />
            ))}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
