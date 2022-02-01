/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Typography,
  AccordionSummary,
  Box,
  Grid,
  AccordionDetails,
  Accordion,
  Avatar,
  Button,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CancelacionByDetails } from '../../interfaces/Cancelacion';
import { SourceAvatar } from '../../helpers/sourceAvatar';
import { ContratoCard } from '../Creditos/conntrato-card';
import { AcuerdoEdit } from '../../view/cancelaciones';

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
    btnRemove: {
      color: 'red',
      border: 1,
      borderStyle: 'solid',
      borderColor: 'red',
    },
  }),
);

interface Props {
  cancelacion: CancelacionByDetails;
  setVisibleFull: Dispatch<SetStateAction<boolean>>;
  setDialogoNotifi: Dispatch<SetStateAction<boolean>>;
  setIdCancelacion: Dispatch<SetStateAction<string>>;
  deleteCancelacion: () => void;
  AcuerdoEditado: AcuerdoEdit[];
}

export const ItemCreditoCancelado = ({
  cancelacion,
  setVisibleFull,
  setDialogoNotifi,
  setIdCancelacion,
  deleteCancelacion,
  AcuerdoEditado,
}: Props) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState<string>('');
  const [NewAcuerdo, setNewAcuerdo] = useState<string>('');

  // Es SOLO para "Re renderizar" este componente <ItemCreditoCancelado />
  console.log(NewAcuerdo.length + ' <ItemCreditoCancelado />');

  useEffect(() => {
    if (cancelacion.acuerdo) {
      setNewAcuerdo(cancelacion.acuerdo);
    }

    const findCancelacion = AcuerdoEditado.find(
      edit => edit.idCancelacion === cancelacion.idCancelacion,
    );

    if (findCancelacion) {
      cancelacion.acuerdo = findCancelacion.acuerdoEdit;
      setNewAcuerdo(findCancelacion.acuerdoEdit);
    }
  }, [AcuerdoEditado, cancelacion]);

  const handleChange = (panel: string) => (_: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : '');
    setIdCancelacion(isExpanded ? panel : '');
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
          {cancelacion.credito.tipo} ( {cancelacion.created_at} ) &nbsp; &nbsp;{' '}
          <strong style={{ color: cancelacion.autorizado ? 'green' : 'red' }}>
            {cancelacion.autorizado ? 'Autorizado' : 'No autorizado'}
          </strong>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid spacing={3} container justify='center'>
          <Grid item xs={12} md={4}>
            <Box p={2} className={classes.headContante}>
              <h4>Información del cliente</h4>
            </Box>
            {RenderContentItemCancelacion({ field: 'Nombres', value: cancelacion.cliente.nombres })}
            {RenderContentItemCancelacion({
              field: 'Apellidos',
              value: cancelacion.cliente.apellidos,
            })}
            {RenderContentItemCancelacion({
              field: 'Email',
              value: cancelacion.cliente.email || '(NONE)',
            })}
            {RenderContentItemCancelacion({
              field: 'Telefono',
              value: cancelacion.cliente.telefono || '(NONE)',
            })}
            {RenderContentItemCancelacion({
              field: 'Ciudad',
              value: cancelacion.cliente.ciudad || '(NONE)',
            })}
            {RenderContentItemCancelacion({ field: 'Sexo', value: cancelacion.cliente.sexo })}
          </Grid>
          <Grid item xs={12} md={4}>
            <Box p={2} className={classes.headContante}>
              <h4>Información del credito</h4>
            </Box>
            {RenderContentItemCancelacion({ field: 'Tipo', value: cancelacion.credito.tipo })}
            {RenderContentItemCancelacion({
              field: 'Monto',
              value: `$${cancelacion.credito.monto}`,
            })}
            {RenderContentItemCancelacion({ field: 'Estado', value: cancelacion.credito.estado })}
            {RenderContentItemCancelacion({
              field: 'Numero',
              value: `#${cancelacion.credito.numeroCredito}`,
            })}
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
            {RenderContentItemCancelacion({ field: 'Rol', value: cancelacion.user.idRol })}
          </Grid>
          <Grid item xs={12} md={4}>
            <Box p={2} className={classes.headContante}>
              <h4>Información de contratos</h4>
            </Box>

            {cancelacion.contratos.map(contrato => (
              <ContratoCard key={contrato.id_credito_contrato} contrato={contrato} />
            ))}
          </Grid>
          <Grid item xs={12}>
            <Button
              className={classes.btnRemove}
              onClick={deleteCancelacion}
              disabled={cancelacion.autorizado ? true : false}
            >
              Remover de cancelación
            </Button>
            {!cancelacion.acuerdo ? (
              <>
                &nbsp; &nbsp;
                <Button variant='outlined' onClick={() => setVisibleFull(true)}>
                  Redactar acuerdo
                </Button>
              </>
            ) : (
              <>
                &nbsp; &nbsp;
                <Button variant='outlined'>Ver acuerdo</Button>
              </>
            )}

            {cancelacion.acuerdo && !cancelacion.autorizado ? (
              <>
                &nbsp; &nbsp;
                <Button variant='outlined' onClick={() => setDialogoNotifi(true)}>
                  Solicitar autorizacón
                </Button>
              </>
            ) : null}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export const RenderContentItemCancelacion = (options: {
  field: string;
  value: string | number;
}) => {
  return (
    <Box borderTop={1} borderColor='success.main' p={2}>
      <Grid spacing={3} container justify='space-between'>
        <Grid item>{options.field}:</Grid>
        <Grid item>{options.value}</Grid>
      </Grid>
    </Box>
  );
};
