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
  Button,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Skeleton from '@material-ui/lab/Skeleton';
import 'react';
import { RowTablePagosByCredito } from './row-table-pagos-by-credito';
import { Pago } from '../../../interfaces/Pago';
import { Cliente } from '../../../interfaces/Cliente';
import { Credito } from '../../../interfaces/Credito';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'react-toast';
import { GetReciboPago, UpdateAprobarPayment, UpdateComprobantePayment } from '../../../api/pagos';
import { HandleError } from '../../../helpers/handleError';
import { MeContext } from '../../../context/contextMe';
import { ImageListType } from 'react-images-uploading';
import { DialogoForm } from '../../DialogoForm';
import { UploadImage } from '../../UploadImage';
import { BASE_API_FILE_DOCUMENT } from '../../../api';

const useStyles = makeStyles((theme: any) => ({
  headTable: {
    backgroundColor: theme.palette.primary.main,
  },
  textHeadTable: {
    color: '#fff',
  },
}));

interface Props {
  pagos: Pago[];
  cliente: Cliente | undefined;
  credito: Credito | undefined;
  Loading: boolean;
  setReloadPago: Dispatch<SetStateAction<boolean>>;
}

export interface AprobarPayment {
  aprobar: number | undefined;
  loading: boolean;
}

export const TablaPagosByCredito = ({ pagos, cliente, credito, Loading, setReloadPago }: Props) => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [idPago, setIdPago] = useState<string>('');
  const [VisibleComprobante, setVisibleComprobante] = useState<boolean>(false);
  const [LoadingUpload, setLoadingUpload] = useState<boolean>(false);
  const [LoadingDownloadPayment, setLoadingDownloadPayment] = useState<boolean>(false);
  const [images, setImages] = useState<ImageListType>([]);
  const [PagoAprobar, setPagoAprobar] = useState<AprobarPayment>({
    aprobar: undefined,
    loading: false,
  });

  const onChange = (imageList: ImageListType) => setImages(imageList as never[]);

  const SkeletonTablePBC = () => {
    return [0, 1, 2, 3, 4, 5, 6, 7].map(item => (
      <Skeleton key={item} style={{ marginBottom: 10 }} variant='rect' width='100%' height={40} />
    ));
  };

  const handleAprobarPago = async () => {
    setPagoAprobar({
      ...PagoAprobar,
      loading: true,
    });

    try {
      await UpdateAprobarPayment({ token, idPago, aprobar: PagoAprobar.aprobar || 0 });
      setPagoAprobar({
        aprobar: undefined,
        loading: false,
      });
      setIdPago('');
      setReloadPago(true);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setPagoAprobar({
        ...PagoAprobar,
        loading: false,
      });
    }
  };

  const UploadComprobantePayment = async () => {
    setLoadingUpload(true);

    try {
      const data = new FormData();
      data.append('comprobante', images[0].file || '');

      await UpdateComprobantePayment({ token, idPago, data });

      toast.success('Se actualizo el comprobante de pago');
      setLoadingUpload(false);
      setVisibleComprobante(false);
      setIdPago('');
      setReloadPago(true);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoadingUpload(false);
    }
  };

  const DownloadReciboPayment = async (idPago: string) => {
    setLoadingDownloadPayment(true);

    try {
      const { fileName } = await (await GetReciboPago({ token, idPago })).data;

      setTimeout(() => {
        const element = document.createElement('a');
        element.target = '_blank';
        element.href = `${BASE_API_FILE_DOCUMENT}/temp/${fileName}`;
        element.click();
        setLoadingDownloadPayment(false);
      }, 4000);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoadingDownloadPayment(false);
    }
  };

  useEffect(() => {
    idPago && PagoAprobar.aprobar !== undefined && handleAprobarPago();
  }, [idPago]);

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
                    <strong>Aprobado</strong>
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
                  pagos.map(pago => (
                    <RowTablePagosByCredito
                      token={token}
                      cliente={cliente}
                      credito={credito}
                      key={pago.idPago}
                      setIdPago={setIdPago}
                      PagoAprobar={PagoAprobar}
                      setPagoAprobar={setPagoAprobar}
                      setVisibleComprobante={setVisibleComprobante}
                      DownloadReciboPayment={DownloadReciboPayment}
                      LoadingDownloadPayment={LoadingDownloadPayment}
                      pago={pago}
                    />
                  ))}
              </TableBody>
            </Table>

            {Loading && SkeletonTablePBC()}

            {!Loading && pagos.length === 0 && (
              <Alert severity='info'>
                Por el momento no hay <strong>Pagos</strong> para mostrar.
              </Alert>
            )}
          </Box>
        </PerfectScrollbar>

        <DialogoForm
          Open={VisibleComprobante}
          setOpen={setVisibleComprobante}
          title='Subir comprobante de pago'
        >
          <UploadImage images={images} maxNumber={1} onChange={onChange} />
          {images.length ? (
            <Button
              color='secondary'
              variant='contained'
              fullWidth
              disabled={LoadingUpload}
              onClick={UploadComprobantePayment}
            >
              Actualizar Comprobante
            </Button>
          ) : (
            ''
          )}
        </DialogoForm>
      </Card>
    </>
  );
};
