/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { useState, useContext, useEffect, Dispatch, SetStateAction } from 'react';
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
import { MeContext } from '../../context/contextMe';
import Alert from '@material-ui/lab/Alert';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Skeleton from '@material-ui/lab/Skeleton';
import { DialogoMessage } from '../DialogoMessage';
import { toast } from 'react-toast';
import { HandleError } from '../../helpers/handleError';
import { AxiosError } from 'axios';
import { DialogoForm } from '../DialogoForm';
import { RowTableGasto } from './row-table-gasto';
import { Gastos } from '../../interfaces/Gastos';
import { DeleteExpenses } from '../../api/caja-chica';

const useStyles = makeStyles((theme: any) => ({
  headTable: {
    backgroundColor: theme.palette.primary.main,
  },
  textHeadTable: {
    color: '#fff',
  },
}));

interface Props {
  gastos: Gastos[];
  Loading: boolean;
  setReloadGasto: Dispatch<SetStateAction<boolean>>;
}

export const TablaGastos = ({ gastos, Loading, setReloadGasto }: Props) => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [IdGasto, setIdGasto] = useState<string>('');
  const [DialogoDelete, setDialogoDelete] = useState<boolean>(false);
  const [DialogoUpdateGasto, setDialogoUpdateGasto] = useState<boolean>(false);
  const [AceptDialog, setAceptDialog] = useState<boolean>(false);

  const SkeletonGastos = () => {
    return [0, 1, 2, 3, 4, 5, 6, 7].map(item => (
      <Skeleton key={item} style={{ marginBottom: 10 }} variant='rect' width='100%' height={40} />
    ));
  };

  useEffect(() => {
    const FetchDelete = async () => {
      try {
        await DeleteExpenses({ token, IdGasto });
        toast.success('Registro eliminado');
        setReloadGasto(true);

        setAceptDialog(false);
        setDialogoDelete(false);
        setIdGasto('');
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
      }
    };

    AceptDialog && IdGasto && FetchDelete();
  }, [AceptDialog, token, IdGasto, setReloadGasto]);

  useEffect(() => {
    if (!DialogoDelete) {
      setIdGasto('');
    }
  }, [DialogoDelete]);

  return (
    <>
      <Card>
        <PerfectScrollbar>
          <Box minWidth={1050}>
            <Table>
              <TableHead className={classes.headTable}>
                <TableRow>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Concepto</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Gasto</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Sucursal</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Creado el</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Observaciones</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Opciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!Loading &&
                  gastos.map(gasto => (
                    <RowTableGasto
                      gasto={gasto}
                      key={gasto.idCajaChica}
                      setIdGasto={setIdGasto}
                      setDialogoDelete={setDialogoDelete}
                      setDialogoUpdateGasto={setDialogoUpdateGasto}
                    />
                  ))}
              </TableBody>
            </Table>

            {Loading && SkeletonGastos()}

            {!Loading && !gastos.length && (
              <Alert severity='info'>
                Por el momento no hay <strong>Gastos</strong> para mostrar.
              </Alert>
            )}
          </Box>
        </PerfectScrollbar>
      </Card>

      <DialogoMessage
        title='Aviso importante'
        Open={DialogoDelete}
        setOpen={setDialogoDelete}
        setAceptDialog={setAceptDialog}
        content='¿Esta seguro que deseas eliminar este registro?, una vez hecho sera irrecuperable.'
      />

      <DialogoForm Open={DialogoUpdateGasto} setOpen={setDialogoUpdateGasto} title=''>
        update
      </DialogoForm>
    </>
  );
};
