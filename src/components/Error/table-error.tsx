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
import { ErrorAppByUser } from '../../interfaces/Error';
import { RowTableError } from './row-table-error';

const useStyles = makeStyles((theme: any) => ({
  headTable: {
    backgroundColor: theme.palette.primary.main,
  },
  textHeadTable: {
    color: '#fff',
  },
}));

interface Props {
  reportesError: ErrorAppByUser[];
  Loading: boolean;
}

export const TablaError = ({ reportesError, Loading }: Props) => {
  const classes = useStyles();

  const SkeletonTableError = () => {
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
                  <TableCell className={classes.textHeadTable}>
                    <strong>Ususario</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Asunto</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Descripcion</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Capture</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Estado</strong>
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
                  reportesError.map(reporte => (
                    <RowTableError key={reporte.idError} reporte={reporte} />
                  ))}
              </TableBody>
            </Table>

            {Loading && SkeletonTableError()}

            {!Loading && !reportesError.length && (
              <Alert severity='info'>
                Por el momento no hay <strong>reportes de problemas</strong> para mostrar.
              </Alert>
            )}
          </Box>
        </PerfectScrollbar>
      </Card>
    </>
  );
};
