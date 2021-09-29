/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  TableRow,
  TableCell,
  Button,
  makeStyles,
  Typography,
  IconButton,
  Menu,
  MenuList,
  MenuItem,
  Chip,
} from '@material-ui/core';
import React, { Dispatch, SetStateAction, useState } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Pago } from '../../../interfaces/Pago';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { Cliente } from '../../../interfaces/Cliente';
import DescriptionIcon from '@material-ui/icons/Description';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Credito } from '../../../interfaces/Credito';
import { DialogoForm } from '../../DialogoForm';
import { DetailsPago } from '../details-pago';
import { AprobarPayment } from './table-pagos-by-credito';

const useStyles = makeStyles((theme: any) => ({
  btnIcon: {
    marginRight: 5,
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  cutText: {
    width: 120,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  textWarning: {
    color: 'orange',
  },
}));

interface Props {
  token: string;
  pago: Pago;
  cliente: Cliente | undefined;
  credito: Credito | undefined;
  setIdPago: Dispatch<SetStateAction<string>>;
  setPagoAprobar: Dispatch<SetStateAction<AprobarPayment>>;
  setVisibleComprobante: Dispatch<SetStateAction<boolean>>;
  PagoAprobar: AprobarPayment;
}

export const RowTablePagosByCredito = ({
  token,
  pago,
  credito,
  cliente,
  setIdPago,
  setPagoAprobar,
  setVisibleComprobante,
  PagoAprobar,
}: Props) => {
  const clases = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [Visible, setVisible] = useState<boolean>(false);
  const open = Boolean(anchorEl);

  const OnClose = () => setAnchorEl(null);

  const RenderPagosByCreditoOPtions = () => {
    return (
      <>
        <IconButton
          aria-label='more'
          aria-controls='long-menu'
          aria-haspopup='true'
          onClick={event => setAnchorEl(event.currentTarget)}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id='long-menu'
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: '25ch',
            },
          }}
        >
          <MenuList>
            <MenuItem
              selected={false}
              onClick={() => {
                OnClose();
                setVisible(true);
              }}
            >
              <Button size='small' title='Ver detalles de pago' fullWidth variant='outlined'>
                <span className={clases.btnIcon}>Detalles</span> <DescriptionIcon />
              </Button>
            </MenuItem>
            <MenuItem
              selected={false}
              onClick={() => {
                setIdPago(pago.idPago);
                setPagoAprobar({
                  loading: true,
                  aprobar: pago.aprobado === 1 ? 0 : 1,
                });
              }}
            >
              <Button
                disabled={PagoAprobar.loading}
                size='small'
                title='Aprobar pago'
                fullWidth
                variant='outlined'
              >
                <span className={clases.btnIcon}>
                  {pago.aprobado ? 'Quitar Aprobra' : 'Aprobar'}
                </span>{' '}
                <CheckCircleIcon />
              </Button>
            </MenuItem>
            <MenuItem
              selected={false}
              onClick={() => {
                setIdPago(pago.idPago);
                OnClose();
                setVisibleComprobante(true);
              }}
            >
              <Button
                disabled={pago.source ? true : false}
                size='small'
                title='Subir comprobante de pago'
                fullWidth
                variant='outlined'
              >
                <span className={clases.btnIcon}>Comprobante</span> <ReceiptIcon />
              </Button>
            </MenuItem>
          </MenuList>
        </Menu>
      </>
    );
  };

  return (
    <>
      <TableRow hover>
        <TableCell>
          {cliente ? cliente.nombres : ''} {cliente ? cliente.apellidos : ''}
        </TableCell>
        <TableCell>
          ( #{credito?.numeroCredito || ''} ) {credito ? credito.tipo : ''}
        </TableCell>
        <TableCell>
          ${credito?.cuota || ''} {pago?.numeroPago === 0 && '+ iva'}
        </TableCell>
        <TableCell>{pago.numeroPago === 0 ? 'APT' : pago.numeroPago}</TableCell>
        <TableCell>
          <Chip
            color={pago.aprobado ? 'secondary' : 'default'}
            label={pago.aprobado ? 'SI' : 'NO'}
          />
        </TableCell>
        <TableCell>
          <Chip
            color={pago.atrasado ? 'secondary' : 'default'}
            label={pago.atrasado ? 'SI' : 'NO'}
          />
        </TableCell>
        <TableCell>
          <Typography className={`${pago.estado === 'Abonado' ? clases.textWarning : ''}`}>
            {credito?.cuota !== pago.valor && '$' + pago.valor} ({pago.estado})
          </Typography>
        </TableCell>
        <TableCell>{pago.pagado_el}</TableCell>
        <TableCell>{pago.created_at}</TableCell>
        <TableCell>{RenderPagosByCreditoOPtions()}</TableCell>
      </TableRow>

      <DialogoForm Open={Visible} setOpen={setVisible} title='Detalles de pago'>
        <DetailsPago token={token} setVisible={setVisible} pago={pago} user={pago.user} />
      </DialogoForm>
    </>
  );
};
