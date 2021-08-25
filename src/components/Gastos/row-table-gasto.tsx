/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  TableRow,
  TableCell,
  Button,
  makeStyles,
  Tooltip,
  Typography,
  IconButton,
  Menu,
  MenuList,
  MenuItem,
} from '@material-ui/core';
import React, { Dispatch, SetStateAction } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Gastos } from '../../interfaces/Gastos';

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
  gasto: Gastos;
  setIdGasto: Dispatch<SetStateAction<string>>;
  setDialogoDelete: Dispatch<SetStateAction<boolean>>;
  setDialogoUpdateGasto: Dispatch<SetStateAction<boolean>>;
}

export const RowTableGasto = ({
  gasto,
  setIdGasto,
  setDialogoDelete,
  setDialogoUpdateGasto,
}: Props) => {
  const clases = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
              <Button
                size='small'
                title='Editar Registro'
                variant='outlined'
                fullWidth
                onClick={() => {
                  setDialogoUpdateGasto(true);
                  setIdGasto(gasto.idCajaChica);
                }}
              >
                <span className={clases.btnIcon}>Editar</span> <EditIcon />
              </Button>
            </MenuItem>
            <MenuItem selected={false} onClick={OnClose}>
              <Button
                size='small'
                title='Eliminar Registro'
                fullWidth
                variant='outlined'
                onClick={() => {
                  setDialogoDelete(true);
                  setIdGasto(gasto.idCajaChica);
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
        <TableCell>{gasto.concepto}</TableCell>
        <TableCell>{gasto.egresos}</TableCell>
        <TableCell>{gasto.idSucursal}</TableCell>
        <TableCell>{gasto.created_at}</TableCell>
        <TableCell>
          <Tooltip title={gasto.observaciones || ''}>
            <Typography className={clases.cutText}>{gasto.observaciones}</Typography>
          </Tooltip>
        </TableCell>
        <TableCell>{renderOPtions()}</TableCell>
      </TableRow>
    </>
  );
};
