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
import { RenderMainViewRol } from '../../helpers/renderViewMainRol';
import { ItemNotification } from '../../components/Notificaciones/item-notificacion';
import { AxiosError } from 'axios';
import { toast } from 'react-toast';
import { GetNotificacion } from '../../api/notificacion';
import { HandleError } from '../../helpers/handleError';
import { NotificacionByMe } from '../../interfaces/Notificacion';
import { ActionNotification } from '../../components/Notificaciones/action-notificacion';

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
}));

interface Props {
  onMobileNavOpen: () => any;
}

const TopBar = ({ onMobileNavOpen, ...rest }: Props) => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
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
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
      }
    };

    fetchNotificacion(1);
  }, []);

  return (
    <>
      <AppBar elevation={0} {...rest}>
        <Toolbar>
          <RouterLink to={RenderMainViewRol(me.idRol)}>
            <img
              src='https://res.cloudinary.com/cici/image/upload/v1627948680/util/logo-crediself_jtbifz.png'
              alt='logo de cici'
              width={60}
              className={classes.iconNav}
            />
          </RouterLink>
          <Box flexGrow={1} />
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
          <Hidden mdDown>
            <IconButton color='inherit' onClick={closeSesion}>
              <InputIcon />
            </IconButton>
          </Hidden>
          <Hidden lgUp>
            <IconButton color='inherit' onClick={onMobileNavOpen}>
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
        <List className={classes.root}>
          {Notificaciones.map(notificacion => (
            <>
              <ItemNotification
                notificacion={notificacion}
                setOpen={setOpen}
                key={notificacion.idNotification}
              />
              <Divider variant='inset' component='li' />
            </>
          ))}
        </List>
        <ActionNotification setOpen={setOpen} />
      </SwipeableDrawer>
    </>
  );
};

export default TopBar;
