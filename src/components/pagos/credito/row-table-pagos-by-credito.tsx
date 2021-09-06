/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  TableRow,
  TableCell,
  Button,
  makeStyles,
  IconButton,
  Menu,
  MenuList,
  MenuItem,
  Chip,
} from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import PaymentIcon from '@material-ui/icons/Payment';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Pago } from '../../../interfaces/Pago';
import { Cliente } from '../../../interfaces/Cliente';
import { Credito } from '../../../interfaces/Credito';

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
}));

interface Props {
  pago: Pago;
  cliente: Cliente | undefined;
  credito: Credito | undefined;
}

export const RowTablePagosByCredito = ({ pago, credito, cliente }: Props) => {
  const clases = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
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
              width: '20ch',
            },
          }}
        >
          <MenuList>
            <MenuItem selected={false} onClick={OnClose}>
              <Link to={`/app/pagos/credito/${pago.idCredito}`}>
                <Button size='small' title='Ver creditos de cliente' fullWidth variant='outlined'>
                  <span className={clases.btnIcon}>Ver Pagos</span> <PaymentIcon />
                </Button>
              </Link>
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
        <TableCell>{pago.tipo_de_pago}</TableCell>
        <TableCell>
          <Chip color='secondary' label={pago.atrasado ? 'SI' : 'NO'} />
        </TableCell>
        <TableCell>{pago.pagado_el}</TableCell>
        <TableCell>{pago.created_at}</TableCell>
        <TableCell>{RenderPagosByCreditoOPtions()}</TableCell>
      </TableRow>
    </>
  );
};
