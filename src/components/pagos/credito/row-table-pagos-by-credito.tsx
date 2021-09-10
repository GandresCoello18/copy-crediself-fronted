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
import React, { useState } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Pago } from '../../../interfaces/Pago';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { Cliente } from '../../../interfaces/Cliente';
import DescriptionIcon from '@material-ui/icons/Description';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Credito } from '../../../interfaces/Credito';
import { DialogoForm } from '../../DialogoForm';
import { DetailsPago } from '../details-pago';

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
  pago: Pago;
  cliente: Cliente | undefined;
  credito: Credito | undefined;
}

export const RowTablePagosByCredito = ({ pago, credito, cliente }: Props) => {
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
            <MenuItem selected={false} onClick={OnClose}>
              <Button size='small' title='Aprobar pago' fullWidth variant='outlined'>
                <span className={clases.btnIcon}>Aprobar</span> <CheckCircleIcon />
              </Button>
            </MenuItem>
            <MenuItem selected={false} onClick={OnClose}>
              <Button size='small' title='Subir comprobante de pago' fullWidth variant='outlined'>
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
          ( #{credito ? credito.numeroCredito : ''} ) {credito ? credito.tipo : ''}
        </TableCell>
        <TableCell>${credito ? credito.cuota : ''}</TableCell>
        <TableCell>{pago.numeroPago}</TableCell>
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
        <DetailsPago setVisible={setVisible} pago={pago} user={pago.user} />
      </DialogoForm>
    </>
  );
};
