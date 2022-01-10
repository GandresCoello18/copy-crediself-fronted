/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { useState, useContext, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  Card,
  TableHead,
  makeStyles,
  TableRow,
} from '@material-ui/core';
import { MeContext } from '../../context/contextMe';
import Alert from '@material-ui/lab/Alert';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Skeleton from '@material-ui/lab/Skeleton';
import { DialogoMessage } from '../DialogoMessage';
import { toast } from 'react-toast';
import { DeleteRole } from '../../api/roles';
import { AxiosError } from 'axios';
import { HandleError } from '../../helpers/handleError';
import { MisComisiones } from '../../interfaces/Comision';
import { RowTableComision } from './table-rol-comision';

const useStyles = makeStyles((theme: any) => ({
  headTable: {
    backgroundColor: theme.palette.primary.main,
  },
  textHeadTable: {
    color: '#fff',
  },
}));

interface Props {
  comision: MisComisiones[];
  Loading: boolean;
}

export const TableCoomision = ({ comision, Loading }: Props) => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [IdRol, setIdRol] = useState<string>('');
  const [DialogoDelete, setDialogoDelete] = useState<boolean>(false);
  const [AceptDialog, setAceptDialog] = useState<boolean>(false);

  const SkeletonRoles = () => {
    return [0, 1, 2, 3].map(item => (
      <Skeleton key={item} style={{ marginBottom: 10 }} variant='rect' width='100%' height={40} />
    ));
  };

  useEffect(() => {
    const FetchDelete = async () => {
      try {
        await DeleteRole({ token, IdRol });
        toast.success('Rol eliminado');
        // setReloadRol(true);

        setAceptDialog(false);
        setDialogoDelete(false);
        setIdRol('');
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
      }
    };

    AceptDialog && IdRol && FetchDelete();
  }, [AceptDialog, token, IdRol]);

  return (
    <>
      <Card>
        <PerfectScrollbar>
          <Box minWidth={1050}>
            <Table>
              <TableHead className={classes.headTable}>
                <TableRow>
                  <TableCell title='usuario beneficiario' className={classes.textHeadTable}>
                    <strong>Usuario</strong>
                  </TableCell>
                  <TableCell title='tipo de comision' className={classes.textHeadTable}>
                    <strong>Tipo Com</strong>
                  </TableCell>
                  <TableCell title='fecha que se registro' className={classes.textHeadTable}>
                    <strong>Fecha</strong>
                  </TableCell>
                  <TableCell title='porcentaje en el calculo' className={classes.textHeadTable}>
                    <strong>Porcent %</strong>
                  </TableCell>
                  <TableCell title='fecha aproximada de paga' className={classes.textHeadTable}>
                    <strong>Fecha ha pagar</strong>
                  </TableCell>
                  <TableCell title='estado de la comision o bono' className={classes.textHeadTable}>
                    <strong>Estado</strong>
                  </TableCell>
                  <TableCell title='total a pagar' className={classes.textHeadTable}>
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell title='opciones' className={classes.textHeadTable}>
                    <strong>Opciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!Loading &&
                  comision.map(com => <RowTableComision key={com.idComisionUser} comision={com} />)}
              </TableBody>
            </Table>

            {Loading && SkeletonRoles()}

            {!Loading && comision.length === 0 && (
              <Alert severity='info'>
                Por el momento no hay <strong>Comisiones</strong> para mostrar.
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
    </>
  );
};
