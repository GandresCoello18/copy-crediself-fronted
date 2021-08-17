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
import { DeleteCliente } from '../../api/clientes';
import { CreditoByCliente } from '../../interfaces/Credito';
import { RowTableCredito } from './row-table-credito';

const useStyles = makeStyles((theme: any) => ({
  headTable: {
    backgroundColor: theme.palette.primary.main,
  },
  textHeadTable: {
    color: '#fff',
  },
}));

interface Props {
  creditos: CreditoByCliente[];
  Loading: boolean;
  setReloadCredito: Dispatch<SetStateAction<boolean>>;
  setSelectCredito: Dispatch<SetStateAction<CreditoByCliente | undefined>>;
}

export const TablaCredito = ({ creditos, Loading, setReloadCredito, setSelectCredito }: Props) => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [IdCredito, setIdCredito] = useState<string>('');
  const [DialogoDelete, setDialogoDelete] = useState<boolean>(false);
  const [DialogoUpdateClient, setDialogoUpdateClient] = useState<boolean>(false);
  const [AceptDialog, setAceptDialog] = useState<boolean>(false);

  const SkeletonCredito = () => {
    return [0, 1, 2, 3, 4, 5, 6, 7].map(item => (
      <Skeleton key={item} style={{ marginBottom: 10 }} variant='rect' width='100%' height={40} />
    ));
  };

  useEffect(() => {
    const FetchDelete = async () => {
      try {
        await DeleteCliente({ token, IdCliente: IdCredito });
        toast.success('Cliente eliminado');
        setReloadCredito(true);

        setAceptDialog(false);
        setDialogoDelete(false);
        setIdCredito('');
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
      }
    };

    AceptDialog && IdCredito && FetchDelete();
  }, [AceptDialog, token, IdCredito, setReloadCredito]);

  useEffect(() => {
    if (!DialogoDelete) {
      setIdCredito('');
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
                    <strong>Cliente</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Tipo</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Monto</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Creado el</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Autorizado</strong>
                  </TableCell>
                  <TableCell className={classes.textHeadTable}>
                    <strong>Activo</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!Loading &&
                  creditos.map(credito => (
                    <RowTableCredito
                      credito={credito}
                      key={credito.idCredito}
                      setSelectCredito={setSelectCredito}
                    />
                  ))}
              </TableBody>
            </Table>

            {Loading && SkeletonCredito()}

            {!Loading && creditos.length === 0 && (
              <Alert severity='info'>
                Por el momento no hay <strong>Creditos</strong> para mostrar.
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

      <DialogoForm Open={DialogoUpdateClient} setOpen={setDialogoUpdateClient} title=''>
        update
      </DialogoForm>
    </>
  );
};
