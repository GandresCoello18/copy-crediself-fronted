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
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PaymentIcon from '@material-ui/icons/Payment';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { PagoByCredito } from '../../interfaces/Pago';
import { DialogoForm } from '../DialogoForm';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import { DetailsCreditoPago } from './details-credito-pago';

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
  pagosByCredito: PagoByCredito;
  isModal?: boolean;
}

export const RowTablePagosByCreditos = ({ pagosByCredito, isModal }: Props) => {
  const clases = useStyles();
  const [Visible, setVisible] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const OnClose = () => setAnchorEl(null);

  const VisibleModal = () => isModal && setVisible(true);

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
          <MenuList id='menu-list-pago'>
            <MenuItem selected={false} onClick={OnClose}>
              <Link to={`/app/pagos/credito/${pagosByCredito.credito.idCredito}`}>
                <Button size='small' title='Ver pagos del credito' fullWidth variant='outlined'>
                  <span className={clases.btnIcon}>Ver Pagos</span> <PaymentIcon />
                </Button>
              </Link>
            </MenuItem>
            <MenuItem selected={false} onClick={OnClose}>
              <Link to={`/app/creditos/${pagosByCredito.credito.idCredito}`}>
                <Button size='small' title='Ver creditos del cliente' fullWidth variant='outlined'>
                  <span className={clases.btnIcon}>Ver Credito</span> <AssignmentIndIcon />
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
        <TableCell onClick={VisibleModal}>
          {pagosByCredito.cliente.nombres} {pagosByCredito.cliente.apellidos}
        </TableCell>
        <TableCell onClick={VisibleModal}>
          ( #{pagosByCredito.credito.numeroCredito} ) {pagosByCredito.credito.tipo}
        </TableCell>
        <TableCell onClick={VisibleModal}>
          ${pagosByCredito.credito.cuota} {pagosByCredito.numeroPago === 0 && '+ Iva'}
        </TableCell>
        <TableCell onClick={VisibleModal}>{pagosByCredito.numeroPago}</TableCell>
        <TableCell onClick={VisibleModal}>{pagosByCredito.tipo_de_pago}</TableCell>
        <TableCell onClick={VisibleModal}>
          <Chip
            color={pagosByCredito.atrasado ? 'secondary' : 'default'}
            label={pagosByCredito.atrasado ? 'SI' : 'NO'}
          />
        </TableCell>
        <TableCell onClick={VisibleModal}>
          <Typography
            className={`${pagosByCredito.estado === 'Abonado' ? clases.textWarning : ''}`}
          >
            {pagosByCredito.credito.cuota !== pagosByCredito.valor &&
            pagosByCredito.estado === 'Abonado'
              ? '$' + pagosByCredito.valor
              : ''}{' '}
            ({pagosByCredito.estado})
          </Typography>
        </TableCell>
        <TableCell onClick={VisibleModal}>{pagosByCredito.pagado_el}</TableCell>
        <TableCell onClick={VisibleModal}>{pagosByCredito.created_at}</TableCell>
        <TableCell>{RenderCreditoOPtions()}</TableCell>
      </TableRow>

      <DialogoForm Open={Visible} setOpen={setVisible} title=''>
        <DetailsCreditoPago
          credito={pagosByCredito.credito}
          cliente={pagosByCredito.cliente}
          user={pagosByCredito.user}
          setVisible={setVisible}
        />
      </DialogoForm>
    </>
  );
};
