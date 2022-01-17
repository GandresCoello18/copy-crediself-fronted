/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { Dispatch, SetStateAction } from 'react';
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
import { Me } from '../../context/contextMe';
import Alert from '@material-ui/lab/Alert';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Skeleton from '@material-ui/lab/Skeleton';
import { Acreditacion } from '../../interfaces/Cliente';
import { RowTableAcreditacion } from './row-table-acreditacion';

const useStyles = makeStyles((theme: any) => ({
  headTable: {
    backgroundColor: theme.palette.primary.main,
  },
  textHeadTable: {
    color: '#fff',
  },
}));

interface Props {
  clientes: Acreditacion[];
  Loading: boolean;
  setIds: Dispatch<SetStateAction<string[]>>;
  Ids: string[];
  me: Me;
}

export const TablaClienteAcreditacion = ({ clientes, Loading, setIds, Ids, me }: Props) => {
  const classes = useStyles();

  const SkeletonUser = () => {
    return [0, 1, 2, 3, 4, 5, 6, 7].map(item => (
      <Skeleton key={item} style={{ marginBottom: 10 }} variant='rect' width='100%' height={40} />
    ));
  };

  return (
    <>
      <Card>
        <PerfectScrollbar>
          <Box minWidth={1050}>
            <Table>
              <TableHead className={classes.headTable}>
                <TableRow>
                  {me.idRol === 'Director' ? (
                    <TableCell title='Seleccionar este cliente' className={classes.textHeadTable}>
                      <strong>Check</strong>
                    </TableCell>
                  ) : null}
                  <TableCell title='Datos del cliente' className={classes.textHeadTable}>
                    <strong>Cliente</strong>
                  </TableCell>
                  <TableCell title='Direccion de correo' className={classes.textHeadTable}>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell title='Tipo credito Bic | Auto' className={classes.textHeadTable}>
                    <strong>Tipo Credito</strong>
                  </TableCell>
                  <TableCell title='Numero de credito' className={classes.textHeadTable}>
                    <strong>Numero</strong>
                  </TableCell>
                  <TableCell title='Monto solicitado' className={classes.textHeadTable}>
                    <strong>Monto</strong>
                  </TableCell>
                  <TableCell title='Fecha registrado el credito' className={classes.textHeadTable}>
                    <strong>Acreditado</strong>
                  </TableCell>
                  <TableCell title='Estado del credito' className={classes.textHeadTable}>
                    <strong>Estado</strong>
                  </TableCell>
                  <TableCell title='Credito autorizado' className={classes.textHeadTable}>
                    <strong>Autorizado</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Opciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!Loading &&
                  clientes.map(item => (
                    <RowTableAcreditacion
                      Acreditacion={item}
                      key={item.idCliente}
                      setIds={setIds}
                      Ids={Ids}
                      rol={me.idRol}
                    />
                  ))}
              </TableBody>
            </Table>

            {Loading && SkeletonUser()}

            {!Loading && !clientes.length && (
              <Alert severity='info'>
                Por el momento no hay <strong>Clientes</strong> para mostrar.
              </Alert>
            )}
          </Box>
        </PerfectScrollbar>
      </Card>
    </>
  );
};
