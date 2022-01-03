/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  TableRow,
  TableCell,
  Checkbox,
  Avatar,
  Switch,
  Box,
  Typography,
  Button,
  makeStyles,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  Chip,
} from '@material-ui/core';
import React, { useState, Dispatch, SetStateAction, useContext } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { MeContext } from '../../context/contextMe';
import { toast } from 'react-toast';
import { AxiosError } from 'axios';
import { HandleError } from '../../helpers/handleError';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { UsuarioAsignacion } from '../../interfaces/Usuario';
import getInitials from '../../util/getInitials';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import { SourceAvatar } from '../../helpers/sourceAvatar';
import { AsignUsusario, DisableInputUser } from './table-user';
import { UpdateActiveUser } from '../../api/users';

const useStyles = makeStyles(theme => ({
  btnDelete: {
    backgroundColor: theme.palette.error.main,
  },
  btnEdit: {
    backgroundColor: theme.palette.warning.main,
  },
  btnAsign: {
    backgroundColor: theme.palette.info.main,
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
}));

interface Props {
  user: UsuarioAsignacion;
  isMe: boolean;
  IdsUser: string[];
  disabledInput: DisableInputUser;
  setIdUser: Dispatch<SetStateAction<string>>;
  setIdsUser: Dispatch<SetStateAction<string[]>>;
  setDialogoDelete: Dispatch<SetStateAction<boolean>>;
  setDialogoUpdateRol: Dispatch<SetStateAction<boolean>>;
  setDialogoAsignaUser: Dispatch<SetStateAction<boolean>>;
  setAsignUser: Dispatch<SetStateAction<AsignUsusario>>;
  setDialogoAddAsesor: Dispatch<SetStateAction<boolean>>;
}

export const RowTableUser = ({
  user,
  isMe,
  IdsUser,
  disabledInput,
  setIdUser,
  setIdsUser,
  setDialogoDelete,
  setDialogoUpdateRol,
  setDialogoAsignaUser,
  setAsignUser,
  setDialogoAddAsesor,
}: Props) => {
  const clases = useStyles();
  const { token, me } = useContext(MeContext);
  const [isActive, setIsActive] = useState<boolean>(user.active ? true : false);
  const [loading, setLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleActive = async (check: boolean) => {
    setLoading(true);

    try {
      await UpdateActiveUser({ token, active: check, IdUser: user.idUser });
      setLoading(false);
      setIsActive(check);
    } catch (error) {
      setLoading(false);
      toast.error(HandleError(error as AxiosError));
    }
  };

  const handleCheck = (check: boolean) => {
    if (check) {
      setIdsUser([...IdsUser, user.idUser]);
    } else {
      const newIds = IdsUser.filter(id => id !== user.idUser);
      setIdsUser([...newIds]);
    }
  };

  const renderAsing = () => {
    if (user.asesores.length) {
      setAsignUser({
        data: user.asesores,
        type: 'Asesores',
      });
      setDialogoAsignaUser(true);
    }

    if (user.supervidor) {
      setAsignUser({
        data: [user.supervidor],
        type: 'Supervisor',
      });
      setDialogoAsignaUser(true);
    }
  };

  const OnClose = () => setAnchorEl(null);

  const RenderUsuarioOPtions = () => {
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
              <Button
                size='small'
                title='Ver usuarios asignados'
                className={clases.btnAsign}
                variant='contained'
                onClick={() => renderAsing()}
              >
                Asignados <SupervisedUserCircleIcon />
              </Button>
            </MenuItem>
            {user.idRol === 'Supervisor' ? (
              <MenuItem selected={false} onClick={OnClose}>
                <Button
                  size='small'
                  title={`Agregar ${user.asesores.length ? 'Asesor' : ''} ${
                    user.supervidor ? 'Supervisor' : ''
                  }`}
                  className={clases.btnEdit}
                  variant='contained'
                  onClick={() => {
                    setDialogoAddAsesor(true);
                    setIdUser(user.idUser);
                  }}
                >
                  Añadir &nbsp; <PersonAddIcon />
                </Button>
              </MenuItem>
            ) : (
              ''
            )}
          </MenuList>
        </Menu>
      </>
    );
  };

  const renderAcction = () => {
    if (!isMe && disabledInput.delete) {
      return (
        <Button
          size='small'
          title='Eliminar rol'
          className={clases.btnDelete}
          variant='contained'
          onClick={() => {
            setDialogoDelete(true);
            setIdUser(user.idUser);
          }}
        >
          <DeleteIcon />
        </Button>
      );
    }

    if (!isMe && disabledInput.updateRol) {
      return (
        <Button
          size='small'
          title='Cambiar rol'
          className={clases.btnEdit}
          variant='contained'
          onClick={() => {
            setDialogoUpdateRol(true);
            setIdUser(user.idUser);
          }}
        >
          <ImportExportIcon />
        </Button>
      );
    }
  };

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Checkbox
            checked={IdsUser.find(id => id === user.idUser) ? true : false}
            disabled={!disabledInput.check}
            onChange={check => handleCheck(check.target.checked)}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        </TableCell>
        <TableCell>
          <Box alignItems='center' display='flex'>
            <Avatar className={clases.avatar} src={SourceAvatar(user.avatar)}>
              {getInitials(user.nombres)}
            </Avatar>
            <Typography color='textPrimary' variant='body1'>
              {user.nombres}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>{user.apellidos}</TableCell>
        <TableCell>{user.userName || <Chip color='primary' label='None' />}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.sexo}</TableCell>
        <TableCell>{user.created_at}</TableCell>
        <TableCell>{user.idRol || <Chip color='primary' label='None' />}</TableCell>
        <TableCell>
          {!isMe ? (
            loading ? (
              <CircularProgress color='secondary' />
            ) : (
              <Switch
                checked={isActive}
                onChange={value => handleActive(value.target.checked)}
                disabled={!disabledInput.switch}
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            )
          ) : (
            ''
          )}
        </TableCell>
        <TableCell>
          {(user.idRol === 'Supervisor' || user.idRol === 'Asesor') &&
            me.idRol === 'RRHH' &&
            RenderUsuarioOPtions()}
          {renderAcction()}
        </TableCell>
      </TableRow>
    </>
  );
};
