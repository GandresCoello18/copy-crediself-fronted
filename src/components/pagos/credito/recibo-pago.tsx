/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useParams } from 'react-router';
import React, { useContext, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'react-toast';
import { GetPagosByCredito, GetReciboPagosByCredito } from '../../../api/pagos';
import { HandleError } from '../../../helpers/handleError';
import { Pagination } from '@material-ui/lab';
import { Cliente } from '../../../interfaces/Cliente';
import { Pago } from '../../../interfaces/Pago';
import { MeContext } from '../../../context/contextMe';
import { ParamsFilterPagos } from '../../../view/pagos-credito';
import { Credito } from '../../../interfaces/Credito';
import { NumeroALetras } from '../../../helpers/number';
import { BASE_API_FILE_DOCUMENT } from '../../../api';

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
  const params = useParams();
  const { token, me } = useContext(MeContext);
  const [FileName, setFileName] = useState<string>('');
  const [SelectPage, setSelectPage] = useState<number>(0);
  const [Loading, setLoading] = useState<boolean>(false);
  const [LoadingDownload, setLoadingDownload] = useState<boolean>(false);
  const [Count, setCount] = useState<number>(0);
  const [Pagos, setPagos] = useState<Pago[]>([]);
  const [CreditoData, setCredito] = useState<Credito | undefined>(undefined);
  const [ParamsFilter] = useState<ParamsFilterPagos>({
    typePayment: undefined,
    isAtrasado: 0,
    datePayment: undefined,
    dateRegister: undefined,
    dateCorrespondiente: undefined,
  });
  const [ClienteData, setCliente] = useState<Cliente | undefined>(undefined);

  const fetchPagos = async (page: number) => {
    setLoading(true);

    try {
      const { pagos, cliente, credito, pages } = await (
        await GetPagosByCredito({ token, idCredito: params.idCredito, page, ParamsFilter })
      ).data;
      setPagos(pagos);
      setCount(pages || 1);
      setSelectPage(1);
      setCredito(credito);
      setCliente(cliente);
      setLoading(false);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    params.idCredito && fetchPagos(1);
  }, [params]);

  const SelectItemPagination = (page: number) => {
    fetchPagos(page);
    setSelectPage(page);
  };

  const DownloadRecibo = async (page: number) => {
    setLoadingDownload(true);

    try {
      const { fileName } = await (
        await GetReciboPagosByCredito({ token, idCredito: params.idCredito, page })
      ).data;

      setTimeout(() => {
        const element = document.createElement('a');
        element.target = '_blank';
        element.href = `${BASE_API_FILE_DOCUMENT}/temp/${fileName}`;
        element.click();
        setLoadingDownload(false);
        setFileName(fileName);
      }, 4000);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoadingDownload(false);
    }
  };

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
        <Grid item xs={7}>
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
          </Grid>

          <br />
          <br />
          {Loading ? (
            <CircularProgress />
          ) : (
            <PerfectScrollbar>
              <Table aria-label='spanning table'>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.celda} align='center'>
                      <strong>Nombre:</strong>
                    </TableCell>
                    <TableCell colSpan={2} className={classes.celda} align='center'>
                      {ClienteData?.nombres} {ClienteData?.apellidos}
                    </TableCell>
                    <TableCell className={classes.celda} align='center'>
                      <strong>Folio:</strong>
                    </TableCell>
                    <TableCell colSpan={2} className={classes.celda} align='center'>
                      {CreditoData?.numeroCredito}
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
                      {ClienteData?.rfc}
                    </TableCell>
                    <TableCell className={classes.celda} align='center'>
                      <strong>Lugar de expediciòn:</strong>
                    </TableCell>
                    <TableCell colSpan={2} className={classes.celda} align='center'>
                      {me.idSucursal}
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
                      ${CreditoData?.monto}
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
                  {Pagos.sort((a, b) => a.numeroPago - b.numeroPago).map(pago => (
                    <TableRow key={pago.idPago}>
                      <TableCell className={classes.celda} align='center'>
                        {pago.numeroPago === 0 ? 'Apertura' : 'Pago' + ' ' + pago.numeroPago}
                      </TableCell>
                      <TableCell className={classes.celda} align='center'>
                        Servicio
                      </TableCell>
                      <TableCell className={classes.celda} align='center'>
                        ${pago.valor}
                      </TableCell>
                      <TableCell className={classes.celda} align='center'>
                        {pago.estado}
                      </TableCell>
                      <TableCell className={classes.celda} align='center'>
                        {pago.numeroPago === 0 ? '$' + CreditoData?.iva : ''}
                      </TableCell>
                      <TableCell className={classes.celda} align='center'></TableCell>
                      <TableCell className={classes.celda} align='center'></TableCell>
                      <TableCell className={classes.celda} align='center'>
                        $
                        {pago.numeroPago === 0 ? pago.valor + Number(CreditoData?.iva) : pago.valor}
                      </TableCell>
                    </TableRow>
                  ))}
                  {renderRowEmpty()}
                  {renderRowEmpty()}
                  <TableRow>
                    <TableCell className={classes.celda}>
                      <strong>Cantidad en letra:</strong>
                    </TableCell>
                    <TableCell colSpan={5} className={classes.celda}>
                      {NumeroALetras(Pagos.reduce((a, b) => a + b.valor, 0))}
                    </TableCell>
                    <TableCell className={classes.celda}>
                      <strong>Total:</strong>
                    </TableCell>
                    <TableCell className={classes.celda}>
                      ${Pagos.reduce((a, b) => a + b.valor, 0)}
                    </TableCell>
                  </TableRow>
                  {renderRowEmpty()}
                </TableBody>
              </Table>
            </PerfectScrollbar>
          )}
        </Grid>
      </Grid>

      <Box mt={3} display='flex' justifyContent='center'>
        <Pagination
          count={Count}
          color='secondary'
          onChange={(event, page) => SelectItemPagination(page)}
        />
      </Box>

      <br />
      <br />

      <Grid container spacing={3} justify='center'>
        {FileName ? (
          <Grid item>
            <a target='_blank' rel='noreferrer' href={`${BASE_API_FILE_DOCUMENT}/temp/${FileName}`}>
              <Button color='secondary' variant='contained'>
                Ver Recibo
              </Button>
            </a>
          </Grid>
        ) : (
          <>
            <Grid item>
              <Button
                onClick={() => DownloadRecibo(SelectPage)}
                color='primary'
                disabled={Loading || LoadingDownload}
                variant='contained'
              >
                Generar Recibo por sección
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => DownloadRecibo(0)}
                color='primary'
                disabled={Loading || LoadingDownload}
                variant='contained'
              >
                Generar Recibo Completo
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};
