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
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { ErrorAppByUser } from '../../interfaces/Error';
import { BASE_API_IMAGES_CLOUDINNARY } from '../../api';
import DeleteIcon from '@material-ui/icons/Delete';

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
  reporte: ErrorAppByUser;
}

export const RowTableError = ({ reporte }: Props) => {
  const clases = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const OnClose = () => setAnchorEl(null);

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
