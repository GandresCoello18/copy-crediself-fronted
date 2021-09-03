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
import CardTravelIcon from '@material-ui/icons/CardTravel';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { PagoByCredito } from '../../interfaces/Pago';

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
  pagosByCredito: PagoByCredito;
}

export const RowTablePagosByCredito = ({ pagosByCredito }: Props) => {
  const clases = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const OnClose = () => setAnchorEl(null);

  const RenderCreditoOPtions = () => {
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
              <Link to={`/app/creditos/cliente/${0}`}>
                <Button size='small' title='Ver creditos de cliente' fullWidth variant='outlined'>
                  <span className={clases.btnIcon}>Creditos</span> <CardTravelIcon />
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
          {pagosByCredito.cliente.nombres} {pagosByCredito.cliente.apellidos}
        </TableCell>
        <TableCell>
          ( #{pagosByCredito.credito.numeroCredito} ) {pagosByCredito.credito.tipo}
        </TableCell>
        <TableCell>${pagosByCredito.credito.cuota}</TableCell>
        <TableCell>{pagosByCredito.numeroPago}</TableCell>
        <TableCell>{pagosByCredito.tipo_de_pago}</TableCell>
        <TableCell>
          <Chip color='secondary' label={pagosByCredito.atrasado ? 'SI' : 'NO'} />
        </TableCell>
        <TableCell>{pagosByCredito.pagado_el}</TableCell>
        <TableCell>{pagosByCredito.created_at}</TableCell>
        <TableCell>{RenderCreditoOPtions()}</TableCell>
      </TableRow>
    </>
  );
};
