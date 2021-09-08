/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import {
  Box,
  Table,
  TableBody,
  TableCell,
  Card,
  makeStyles,
  TableHead,
  TableRow,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Skeleton from '@material-ui/lab/Skeleton';
import { PagoByCredito } from '../../interfaces/Pago';
import { RowTablePagosByCreditos } from './row-table-pagos';
import { useEffect, useState } from 'react';

const useStyles = makeStyles((theme: any) => ({
  headTable: {
    backgroundColor: theme.palette.primary.main,
  },
  textHeadTable: {
    color: '#fff',
  },
}));

interface Props {
  pagosByCreditos: PagoByCredito[];
  Loading: boolean;
}

export const TablaPagosByCreditos = ({ pagosByCreditos, Loading }: Props) => {
  const classes = useStyles();
  const [PathName, setPathName] = useState<string>('');

  const SkeletonTablePBC = () => {
    return [0, 1, 2, 3, 4, 5, 6, 7].map(item => (
      <Skeleton key={item} style={{ marginBottom: 10 }} variant='rect' width='100%' height={40} />
    ));
  };

  useEffect(() => {
    setPathName(window.location.pathname);
  }, []);

  return (
    <>
      <Card>
        <PerfectScrollbar>
          <Box minWidth={1050}>
            <Table>
              <TableHead className={classes.headTable}>
                <TableRow>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Cliente</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Credito</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Cuota</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong># Pago</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Metodo</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Atrasado</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Valor</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Pagado el</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Registrado el</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Opciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!Loading &&
                  pagosByCreditos.map(pagosByCredito => (
                    <RowTablePagosByCreditos
                      key={pagosByCredito.idPago}
                      pagosByCredito={pagosByCredito}
                      isModal={PathName.indexOf('credito') < 0 ? true : false}
                    />
                  ))}
              </TableBody>
            </Table>

            {Loading && SkeletonTablePBC()}

            {!Loading && pagosByCreditos.length === 0 && (
              <Alert severity='info'>
                Por el momento no hay <strong>Pagos de creditos</strong> para mostrar.
              </Alert>
            )}
          </Box>
        </PerfectScrollbar>
      </Card>
    </>
  );
};
