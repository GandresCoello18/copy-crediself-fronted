/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  SwipeableDrawer,
  makeStyles,
  Divider,
  List,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
import MailIcon from '@material-ui/icons/Mail';
import Cookies from 'js-cookie';
import { useEffect, useState, useContext } from 'react';
import { MeContext } from '../../context/contextMe';
import { getPermisoExist, RenderMainViewRol } from '../../helpers/renderViewMainRol';
import { ItemNotification } from '../../components/Notificaciones/item-notificacion';
import { AxiosError } from 'axios';
import CancelIcon from '@material-ui/icons/Cancel';
import { toast } from 'react-toast';
import { GetNotificacion } from '../../api/notificacion';
import { HandleError } from '../../helpers/handleError';
import { NotificacionByMe } from '../../interfaces/Notificacion';
import { ActionNotification } from '../../components/Notificaciones/action-notificacion';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme: any) => ({
  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  spaceBadge: {
    marginRight: 10,
    cursor: 'pointer',
  },
  iconNav: {
    borderRadius: 5,
    border: '1px solid #fff',
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
}));

interface Props {
  onMobileNavOpen: () => any;
}

const TopBar = ({ onMobileNavOpen, ...rest }: Props) => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [ReloadNotificacion, setReloadNotificacion] = useState<boolean>(false);
  const [Notificaciones, setNotificaciones] = useState<NotificacionByMe[]>([]);
  const { token, me } = useContext(MeContext);

  const closeSesion = () => {
    Cookies.remove('access-token-crediself');
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchNotificacion = async (page: number) => {
      try {
        const { notifications } = await (await GetNotificacion({ token, page })).data;
        setNotificaciones(notifications);

        if (
          notifications.length &&
          notifications.some((noti: NotificacionByMe) => noti.isRead === 0)
        ) {
          toast.info('Tienes mensajes pendientes');
        }
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
      }
    };

    if (getPermisoExist({ RolName: me.idRol, permiso: 'ViewNotification' })) {
      fetchNotificacion(1);
    }

    if (ReloadNotificacion) {
      setReloadNotificacion(false);
    }
  }, [ReloadNotificacion, me]);

  return (
    <>
      <AppBar elevation={0} {...rest}>
        <Toolbar>
          <RouterLink to={RenderMainViewRol(me.idRol)}>
            {me.empresa === 'CREDISELF' ? (
              <img
                src='https://res.cloudinary.com/cici/image/upload/v1627948680/util/logo-crediself_jtbifz.png'
                alt='logo de crediself'
                title='logo de crediself'
                width={60}
                className={classes.iconNav}
              />
            ) : null}

            {me.empresa === 'AUTOIMPULZADORA' ? (
              <img
                src='https://res.cloudinary.com/cici/image/upload/v1629240101/util/WhatsApp_Image_2021-03-04_at_2.09.52_PM_2_mvg89p.jpg'
                alt='logo de auto impulsadora'
                title='logo de auto impulsadora'
                width={60}
                className={classes.iconNav}
              />
            ) : null}

            {!me.empresa ? (
              <img
                src='../../placeholder-picture.png'
                alt='sin logo'
                title='sin logo'
                width={60}
                className={classes.iconNav}
              />
            ) : null}
          </RouterLink>
          <Box flexGrow={1} />
          {getPermisoExist({ RolName: me.idRol, permiso: 'ViewNotification' }) ? (
            <Hidden>
              <IconButton color='inherit' onClick={() => setOpen(true)}>
                <Badge
                  badgeContent={Notificaciones.filter(noti => noti.isRead === 0).length}
                  color='secondary'
                  className={classes.spaceBadge}
                >
                  <MailIcon />
                </Badge>
              </IconButton>
            </Hidden>
          ) : null}
          <Hidden mdDown>
            <IconButton color='inherit' onClick={closeSesion}>
              <InputIcon />
            </IconButton>
          </Hidden>
          <Hidden lgUp>
            <IconButton id='menuLateral' color='inherit' onClick={onMobileNavOpen}>
              <MenuIcon />
            </IconButton>
          </Hidden>
        </Toolbar>
      </AppBar>

      <SwipeableDrawer
        anchor='top'
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <div className={classes.close} onClick={() => setOpen(false)}>
          <CancelIcon style={{ fontSize: 35 }} />
        </div>

        <List className={classes.root}>
          {!Notificaciones.length && (
            <Alert severity='info'>
              Por el momento no hay <strong>Notificaciones</strong> para mostrar.
            </Alert>
          )}
          {Notificaciones.map((notificacion, index) => (
            <Box key={notificacion.idNotification + index}>
              <ItemNotification notificacion={notificacion} setOpen={setOpen} />
              <Divider variant='inset' component='li' />
            </Box>
          ))}
        </List>
        <ActionNotification
          disabled={Notificaciones.length === 0}
          setOpen={setOpen}
          setReloadNotificacion={setReloadNotificacion}
        />
      </SwipeableDrawer>
    </>
  );
};

export default TopBar;
