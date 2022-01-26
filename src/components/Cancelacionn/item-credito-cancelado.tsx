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
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
  }),
);

export const ItemCreditoCancelado = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState<string>('');

  const handleChange = (panel: string) => (_: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : '');
  };

  const RenderContent = (options: { field: string; value: string | number }) => {
    return (
      <Box borderTop={1} borderColor='success.main' p={2}>
        <Grid spacing={3} container justify='space-between'>
          <Grid item>{options.field}</Grid>
          <Grid item>{options.value}</Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1bh-content'
        id='panel1bh-header'
      >
        <Typography className={classes.heading}>General settings</Typography>
        <Typography className={classes.secondaryHeading}>I am an accordion</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid spacing={3} container justify='center'>
          <Grid item xs={12} md={4}>
            <Box p={2} className={classes.headContante}>
              <h4>Información del cliente</h4>
            </Box>
            {RenderContent({ field: 'soy campo', value: 11110 })}
            {RenderContent({ field: 'soy campo', value: 11110 })}
            {RenderContent({ field: 'soy campo', value: 11110 })}
            {RenderContent({ field: 'soy campo', value: 11110 })}
            {RenderContent({ field: 'soy campo', value: 11110 })}
            {RenderContent({ field: 'soy campo', value: 11110 })}
            {RenderContent({ field: 'soy campo', value: 11110 })}
          </Grid>
          <Grid item xs={12} md={4}>
            <Box p={2} className={classes.headContante}>
              <h4>Información del credito</h4>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box p={2} className={classes.headContante}>
              <h4>Información del usuario</h4>
            </Box>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
