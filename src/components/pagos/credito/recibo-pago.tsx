/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  Button,
  Grid,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import React from 'react';

const useStyles = makeStyles(() => ({
  title: {
    fontSize: 25,
    marginLeft: 15,
    marginTop: 25,
  },
  celda: {
    border: '1px solid #cdcdcd',
  },
}));

export const ReciboPagoView = () => {
  const classes = useStyles();

  const renderRowEmpty = () => {
    return (
      <TableRow>
        <TableCell className={classes.celda}></TableCell>
        <TableCell className={classes.celda}></TableCell>
        <TableCell className={classes.celda}></TableCell>
        <TableCell className={classes.celda}></TableCell>
        <TableCell className={classes.celda}></TableCell>
        <TableCell className={classes.celda}></TableCell>
        <TableCell className={classes.celda}></TableCell>
        <TableCell className={classes.celda}></TableCell>
      </TableRow>
    );
  };

  return (
    <>
      <br />
      <Grid container spacing={3} justify='center'>
        <Grid item>
          <img
            src='https://res.cloudinary.com/cici/image/upload/v1629142872/util/ri_1_gwjs1t.png'
            alt='logo crediself'
            width={300}
          />
        </Grid>
        <Grid item>
          <h2 className={classes.title}>RECIBO DE PAGO</h2>
        </Grid>

        <br />
        <br />

        <Grid item xs={10}>
          <PerfectScrollbar>
            <Table aria-label='spanning table'>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.celda} align='center'>
                    <strong>Nombre:</strong>
                  </TableCell>
                  <TableCell colSpan={2} className={classes.celda} align='center'>
                    Andres Coello
                  </TableCell>
                  <TableCell className={classes.celda} align='center'>
                    <strong>Folio:</strong>
                  </TableCell>
                  <TableCell colSpan={2} className={classes.celda} align='center'>
                    000
                  </TableCell>
                  <TableCell className={classes.celda} align='center' rowSpan={2}>
                    <strong>Recibo:</strong>
                  </TableCell>
                  <TableCell className={classes.celda} align='center' rowSpan={2}>
                    000
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.celda} align='center'>
                    <strong>R.F.C:</strong>
                  </TableCell>
                  <TableCell colSpan={2} className={classes.celda} align='center'>
                    FECA710426
                  </TableCell>
                  <TableCell className={classes.celda} align='center'>
                    <strong>Lugar de expediciòn:</strong>
                  </TableCell>
                  <TableCell colSpan={2} className={classes.celda} align='center'>
                    VillaHermosa Tabasco
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.celda}></TableCell>
                  <TableCell className={classes.celda}></TableCell>
                  <TableCell className={classes.celda}></TableCell>
                  <TableCell className={classes.celda}></TableCell>
                  <TableCell className={classes.celda}></TableCell>
                  <TableCell className={classes.celda}></TableCell>
                  <TableCell className={classes.celda} align='right'>
                    <strong>Monto</strong>
                  </TableCell>
                  <TableCell className={classes.celda} align='center'>
                    $456.400.00
                  </TableCell>
                </TableRow>
                {renderRowEmpty()}
                <TableRow>
                  <TableCell align='center' className={classes.celda}>
                    <strong>Concepto</strong>
                  </TableCell>
                  <TableCell align='center' className={classes.celda}>
                    <strong>Unidad Medida</strong>
                  </TableCell>
                  <TableCell align='center' className={classes.celda}>
                    <strong>Importe</strong>
                  </TableCell>
                  <TableCell align='center' className={classes.celda}>
                    <strong>Gasto</strong>
                  </TableCell>
                  <TableCell align='center' className={classes.celda}>
                    <strong>I.V.A</strong>
                  </TableCell>
                  <TableCell align='center' className={classes.celda}>
                    <strong>Seguro</strong>
                  </TableCell>
                  <TableCell align='center' className={classes.celda}>
                    <strong>Fondo</strong>
                  </TableCell>
                  <TableCell align='center' className={classes.celda}>
                    <strong>Total</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell className={classes.celda} align='center'>
                    Apertura
                  </TableCell>
                  <TableCell className={classes.celda} align='center'>
                    Servicio
                  </TableCell>
                  <TableCell className={classes.celda} align='center'>
                    $3,000.00
                  </TableCell>
                  <TableCell className={classes.celda} align='center'></TableCell>
                  <TableCell className={classes.celda} align='center'>
                    $480.00
                  </TableCell>
                  <TableCell className={classes.celda} align='center'></TableCell>
                  <TableCell className={classes.celda} align='center'></TableCell>
                  <TableCell className={classes.celda}>$3,480.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.celda} align='center'>
                    Pago #1
                  </TableCell>
                  <TableCell className={classes.celda} align='center'>
                    Servicio
                  </TableCell>
                  <TableCell className={classes.celda} align='center'>
                    $9,128.00
                  </TableCell>
                  <TableCell className={classes.celda} align='center'></TableCell>
                  <TableCell className={classes.celda} align='center'>
                    $9,128.00
                  </TableCell>
                  <TableCell className={classes.celda} align='center'></TableCell>
                  <TableCell className={classes.celda} align='center'></TableCell>
                  <TableCell className={classes.celda}>$3,480.00</TableCell>
                </TableRow>
                {renderRowEmpty()}
                {renderRowEmpty()}
                <TableRow>
                  <TableCell className={classes.celda}>
                    <strong>Cantidad en letra:</strong>
                  </TableCell>
                  <TableCell colSpan={5} className={classes.celda}>
                    Son DOCE MIL SEISCIENTOS OCHO PESOS
                  </TableCell>
                  <TableCell className={classes.celda}>
                    <strong>Total:</strong>
                  </TableCell>
                  <TableCell className={classes.celda}>$12,608.00</TableCell>
                </TableRow>
                {renderRowEmpty()}
              </TableBody>
            </Table>
          </PerfectScrollbar>
        </Grid>
      </Grid>

      <br />
      <br />

      <Grid container spacing={3} justify='center'>
        <Grid item>
          <Button color='primary' variant='contained'>
            Descargar Recibo
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
