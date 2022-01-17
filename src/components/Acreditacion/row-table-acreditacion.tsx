/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  TableRow,
  TableCell,
  Checkbox,
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  Chip,
} from '@material-ui/core';
import React, { Dispatch, SetStateAction } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CardTravelIcon from '@material-ui/icons/CardTravel';
import { Link } from 'react-router-dom';
import PaymentIcon from '@material-ui/icons/Payment';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import { Acreditacion } from '../../interfaces/Cliente';

interface Props {
  Acreditacion: Acreditacion;
  Ids: string[];
  setIds: Dispatch<SetStateAction<string[]>>;
  rol: string;
}

export const RowTableAcreditacion = ({ Acreditacion, Ids, setIds, rol }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleCheck = (check: boolean) => {
    if (check) {
      setIds([...Ids, Acreditacion.idCredito]);
    } else {
      const newIds = Ids.filter(id => id !== Acreditacion.idCredito);
      setIds([...newIds]);
    }
  };
  const OnClose = () => setAnchorEl(null);

  const RenderOPtions = () => {
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
              maxHeight: 48 * 5.5,
              width: '30ch',
            },
          }}
        >
          <MenuList>
            <MenuItem selected={false} onClick={OnClose}>
              <Link
                style={{ width: '100%' }}
                target='_blank'
                to={`/app/clientes/${Acreditacion.idCliente}`}
              >
                <Button size='small' fullWidth title='Ver detalles del cliente' variant='outlined'>
                  Cliente &nbsp; <EmojiPeopleIcon />
                </Button>
              </Link>
            </MenuItem>
            <MenuItem selected={false} onClick={OnClose}>
              <Link
                style={{ width: '100%' }}
                target='_blank'
                to={`/app/creditos/${Acreditacion.idCredito}`}
              >
                <Button size='small' fullWidth title='Ver detalles del credito' variant='outlined'>
                  Credito &nbsp; <CardTravelIcon />
                </Button>
              </Link>
            </MenuItem>
            <MenuItem selected={false} onClick={OnClose}>
              <Link
                style={{ width: '100%' }}
                target='_blank'
                to={`/app/pagos/credito/${Acreditacion.idCredito}`}
              >
                <Button
                  size='small'
                  fullWidth
                  title='Ver detalles de pago del credito'
                  variant='outlined'
                  onClick={() => true}
                >
                  Pagos del credito &nbsp; <PaymentIcon />
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
        {rol === 'Director' ? (
          <TableCell>
            <Checkbox
              checked={Ids.find(id => id === Acreditacion.idCredito) ? true : false}
              onChange={check => handleCheck(check.target.checked)}
              disabled={Acreditacion.acreditado ? true : false}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </TableCell>
        ) : null}
        <TableCell>
          {Acreditacion.nombres} {Acreditacion.apellidos}
        </TableCell>
        <TableCell>{Acreditacion.email}</TableCell>
        <TableCell>{Acreditacion.tipo}</TableCell>
        <TableCell>{Acreditacion.numeroCredito}</TableCell>
        <TableCell>${Acreditacion.monto}</TableCell>
        <TableCell>
          <Chip
            label={Acreditacion.acreditado ? 'Si' : 'No'}
            color={Acreditacion.acreditado ? 'primary' : 'default'}
          />
        </TableCell>
        <TableCell>
          <Typography style={{ color: Acreditacion.estado === 'Atrasado' ? 'red' : 'green' }}>
            {Acreditacion.estado}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip
            color={Acreditacion.autorizado ? 'primary' : 'default'}
            label={Acreditacion.autorizado ? 'Autorizado' : 'No Autorizado'}
          />
        </TableCell>
        <TableCell>{RenderOPtions()}</TableCell>
      </TableRow>
    </>
  );
};
