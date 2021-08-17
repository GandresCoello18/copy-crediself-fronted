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
} from '@material-ui/core';
import React, { useState, Dispatch, SetStateAction, useContext } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import { MeContext } from '../../context/contextMe';
import { toast } from 'react-toast';
import PostAddIcon from '@material-ui/icons/PostAdd';
import CardTravelIcon from '@material-ui/icons/CardTravel';
import { AxiosError } from 'axios';
import EditIcon from '@material-ui/icons/Edit';
import { HandleError } from '../../helpers/handleError';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Cliente } from '../../interfaces/Cliente';
import { UpdateActiveUser } from '../../api/users';

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
  cliente: Cliente;
  setIdCliente: Dispatch<SetStateAction<string>>;
  setDialogoDelete: Dispatch<SetStateAction<boolean>>;
  setDialogoCredit: Dispatch<SetStateAction<boolean>>;
  setDialogoUpdateClient: Dispatch<SetStateAction<boolean>>;
}

export const RowTableClient = ({
  cliente,
  setIdCliente,
  setDialogoDelete,
  setDialogoCredit,
  setDialogoUpdateClient,
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
      await UpdateActiveUser({ token, active: check, IdUser: cliente.idCliente });
      setLoading(false);
      setIsActive(check);
    } catch (error) {
      setLoading(false);
      toast.error(HandleError(error as AxiosError));
    }
  };

  const OnClose = () => setAnchorEl(null);

  const renderOPtions = () => {
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
              <Link to={`/app/creditos/cliente/${cliente.idCliente}`}>
                <Button
                  size='small'
                  title='Ver creditos de cliente'
                  fullWidth
                  variant='outlined'
                  onClick={() => {
                    setDialogoCredit(true);
                    setIdCliente(cliente.idCliente);
                  }}
                >
                  <span className={clases.btnIcon}>Creditos</span> <CardTravelIcon />
                </Button>
              </Link>
            </MenuItem>
            <MenuItem selected={false} onClick={OnClose}>
              <Button
                size='small'
                title='Solicitar credito'
                variant='outlined'
                fullWidth
                onClick={() => {
                  setDialogoCredit(true);
                  setIdCliente(cliente.idCliente);
                }}
              >
                <span className={clases.btnIcon}>Solicitar</span> <PostAddIcon />
              </Button>
            </MenuItem>
            <MenuItem selected={false} onClick={OnClose}>
              <Button
                size='small'
                title='Editar Cliente'
                variant='outlined'
                fullWidth
                onClick={() => {
                  setDialogoUpdateClient(true);
                  setIdCliente(cliente.idCliente);
                }}
              >
                <span className={clases.btnIcon}>Editar</span> <EditIcon />
              </Button>
            </MenuItem>
            <MenuItem selected={false} onClick={OnClose}>
              <Button
                size='small'
                title='Eliminar Cliente'
                fullWidth
                variant='outlined'
                onClick={() => {
                  setDialogoDelete(true);
                  setIdCliente(cliente.idCliente);
                }}
              >
                <span className={clases.btnIcon}>Eliminar</span> <DeleteIcon />
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
        <TableCell>{cliente.nombres}</TableCell>
        <TableCell>{cliente.apellidos}</TableCell>
        <TableCell>{cliente.email || 'None'}</TableCell>
        <TableCell>{cliente.telefono}</TableCell>
        <TableCell>{cliente.sexo}</TableCell>
        <TableCell>{cliente.created_at}</TableCell>
        <TableCell>{cliente.ciudad}</TableCell>
        <TableCell>
          <Tooltip title={cliente.direccion}>
            <Typography className={clases.cutText}>{cliente.direccion}</Typography>
          </Tooltip>
        </TableCell>
        <TableCell>
          {loading ? (
            <CircularProgress color='secondary' />
          ) : (
            <Switch
              checked={isActive}
              onChange={value => handleActive(value.target.checked)}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          )}
        </TableCell>
        <TableCell>{renderOPtions()}</TableCell>
      </TableRow>
    </>
  );
};
