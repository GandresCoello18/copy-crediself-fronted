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
import React, { Dispatch, SetStateAction, useState } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { ErrorAppByUser } from '../../interfaces/Error';
import { BASE_API_IMAGES_CLOUDINNARY } from '../../api';
import DeleteIcon from '@material-ui/icons/Delete';
import { RemoveErrorApp } from '../../api/errores';
import { AxiosError } from 'axios';
import { toast } from 'react-toast';
import { HandleError } from '../../helpers/handleError';

const useStyles = makeStyles((theme: any) => ({
  btnIcon: {
    marginRight: 5,
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  btnRemove: {
    color: 'red',
    border: '1px solid red',
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
  setReloadError: Dispatch<SetStateAction<boolean>>;
  reporte: ErrorAppByUser;
  token: string;
}

export const RowTableError = ({ setReloadError, reporte, token }: Props) => {
  const clases = useStyles();
  const [Loading, setLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const OnClose = () => setAnchorEl(null);

  const RemoveError = async () => {
    setLoading(true);

    try {
      await RemoveErrorApp({ token, idError: reporte.idError });
      setLoading(false);
      setReloadError(true);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  const RenderErrorOPtions = () => {
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
                className={clases.btnRemove}
                size='small'
                disabled={Loading}
                onClick={RemoveError}
                title='ELiminar registro'
                fullWidth
                variant='outlined'
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
        <TableCell>
          {reporte.user.nombres} {reporte.user.apellidos}
        </TableCell>
        <TableCell>{reporte.asunto}</TableCell>
        <TableCell>{reporte.descripcion}</TableCell>
        <TableCell>
          {reporte.source ? (
            <a
              target='_blank'
              rel='noreferrer'
              href={`${BASE_API_IMAGES_CLOUDINNARY}/${reporte.source}`}
            >
              Ver Imagen
            </a>
          ) : (
            <Chip label='Ninguno' />
          )}
        </TableCell>
        <TableCell>
          <Chip
            color={reporte.estado === 'Atendido' ? 'secondary' : 'primary'}
            label={reporte.estado}
          />
        </TableCell>
        <TableCell>{reporte.created_at}</TableCell>
        <TableCell>{RenderErrorOPtions()}</TableCell>
      </TableRow>
    </>
  );
};
