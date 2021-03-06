/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  TableRow,
  TableCell,
  Switch,
  Button,
  makeStyles,
  Tooltip,
  CircularProgress,
  Typography,
  IconButton,
  Menu,
  MenuList,
  MenuItem,
  Chip,
} from '@material-ui/core';
import React, { useState, Dispatch, SetStateAction, useContext } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import { MeContext } from '../../context/contextMe';
import BlockIcon from '@material-ui/icons/Block';
import { toast } from 'react-toast';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import PostAddIcon from '@material-ui/icons/PostAdd';
import CardTravelIcon from '@material-ui/icons/CardTravel';
import { AxiosError } from 'axios';
import { HandleError } from '../../helpers/handleError';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Cliente } from '../../interfaces/Cliente';
import { PermisoTableClient } from './table-cliente';
import { UpdateActiveCliente } from '../../api/clientes';

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
  textGray: {
    color: '#696969',
  },
}));

interface Props {
  cliente: Cliente;
  permisos: PermisoTableClient;
  setIdCliente: Dispatch<SetStateAction<string>>;
  setDialogoDelete: Dispatch<SetStateAction<boolean>>;
  setDialogoCredit: Dispatch<SetStateAction<boolean>>;
}

export const RowTableClient = ({
  cliente,
  permisos,
  setIdCliente,
  setDialogoDelete,
  setDialogoCredit,
}: Props) => {
  const clases = useStyles();
  const { token } = useContext(MeContext);
  const [isActive, setIsActive] = useState<boolean>(cliente.active ? true : false);
  const [loading, setLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleActive = async (check: boolean) => {
    setLoading(true);

    try {
      await UpdateActiveCliente({ token, active: check, idCliente: cliente.idCliente });
      setLoading(false);
      setIsActive(check);
    } catch (error) {
      setLoading(false);
      toast.error(HandleError(error as AxiosError));
    }
  };

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
              maxHeight: 48 * 5.5,
              width: '22ch',
            },
          }}
        >
          <MenuList>
            <MenuItem selected={false} onClick={OnClose}>
              <Link to={`/app/creditos/cliente/${cliente.idCliente}`}>
                <Button size='small' title='Ver creditos de cliente' fullWidth variant='outlined'>
                  <span className={clases.btnIcon}>Creditos</span> <CardTravelIcon />
                </Button>
              </Link>
            </MenuItem>
            <MenuItem selected={false} onClick={OnClose}>
              <Link to={`/app/clientes/${cliente.idCliente}`}>
                <Button size='small' title='Ver Cliente' variant='outlined' fullWidth>
                  <span className={clases.btnIcon}>Detalles</span> <AccountBoxIcon />
                </Button>
              </Link>
            </MenuItem>
            {permisos.newCredito ? (
              <>
                <MenuItem selected={false} onClick={OnClose}>
                  <Button
                    size='small'
                    title='Solicitar credito'
                    variant='outlined'
                    fullWidth
                    disabled={!cliente.active || !isActive}
                    onClick={() => {
                      setIdCliente(cliente.idCliente);
                      setDialogoCredit(true);
                    }}
                  >
                    <span className={clases.btnIcon}>Solicitar</span> <PostAddIcon />
                  </Button>
                </MenuItem>
                <MenuItem selected={false} onClick={OnClose}>
                  <Button
                    size='small'
                    title='Eliminar Cliente'
                    fullWidth
                    disabled={!cliente.active || !isActive}
                    variant='outlined'
                    onClick={() => {
                      setDialogoDelete(true);
                      setIdCliente(cliente.idCliente);
                    }}
                  >
                    <span className={clases.btnIcon}>Eliminar</span> <DeleteIcon />
                  </Button>
                </MenuItem>
              </>
            ) : null}
          </MenuList>
        </Menu>
      </>
    );
  };

  return (
    <>
      <TableRow hover>
        <TableCell>
          {!cliente.active ||
            (!isActive && (
              <BlockIcon className={clases.textGray} titleAccess='Cliente desactivado' />
            ))}{' '}
          <span className={!cliente.active || !isActive ? clases.textGray : ''}>
            {cliente.nombres}
          </span>
        </TableCell>
        <TableCell>{cliente.apellidos}</TableCell>
        <TableCell>{cliente.email || <Chip color='primary' label='No especificado' />}</TableCell>
        <TableCell>{cliente.telefono || <Chip label='None' color='primary' />}</TableCell>
        <TableCell>{cliente.sexo}</TableCell>
        <TableCell>{cliente.created_at}</TableCell>
        <TableCell>{cliente.ciudad || <Chip label='None' color='primary' />}</TableCell>
        <TableCell>
          <Tooltip title={cliente.direccion || ''}>
            <Typography className={clases.cutText}>
              {cliente.direccion || <Chip label='None' color='primary' />}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell>
          {loading ? (
            <CircularProgress color='secondary' />
          ) : (
            <Switch
              checked={isActive}
              disabled={!permisos.newCredito}
              onChange={value => handleActive(value.target.checked)}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          )}
        </TableCell>
        <TableCell>{RenderCreditoOPtions()}</TableCell>
      </TableRow>
    </>
  );
};
