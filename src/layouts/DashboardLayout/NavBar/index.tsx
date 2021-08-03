/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-undef */
import { useContext, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
  Button,
  ListItem,
} from '@material-ui/core';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import NavItem from './NavItem';
import { MeContext } from '../../../context/contextMe';
import Cookies from 'js-cookie';
import { SourceAvatar } from '../../../helpers/sourceAvatar';

interface Props {
  onMobileClose: () => any;
  openMobile: boolean;
}

const useStyles = makeStyles(theme => ({
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)',
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64,
  },
  navItem: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: 'flex-start',
    letterSpacing: 0,
    padding: '10px 8px',
    textTransform: 'none',
    width: '100%',
  },
  title: {
    marginRight: 'auto',
    color: 'red',
  },
}));

const NavBar = ({ onMobileClose, openMobile }: Props) => {
  const classes = useStyles();
  const { me } = useContext(MeContext);
  let items: any = [];

  switch (me.idRol) {
    case 'Gerente Regional':
      items = [
        {
          href: '/app/dashboard',
          icon: EqualizerIcon,
          title: 'Panel',
        },
        {
          href: '/app/account',
          icon: PersonIcon,
          title: 'Mi cuenta',
        },
      ];
      break;
    case 'Director':
      items = [
        {
          href: '/app/roles',
          icon: SupervisedUserCircleIcon,
          title: 'Roles',
        },
        {
          href: '/app/permisos',
          icon: LockIcon,
          title: 'Permisos',
        },
        {
          href: '/app/account',
          icon: PersonIcon,
          title: 'Mi cuenta',
        },
      ];
      break;
    default:
      items = [];
      break;
  }

  const closeSesion = () => {
    Cookies.remove('access-token-crediself');
    window.location.href = '/login';
  };

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, []);

  const content = (
    <Box height='100%' display='flex' flexDirection='column'>
      <Box alignItems='center' display='flex' flexDirection='column' p={2}>
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src={SourceAvatar(me.avatar)}
          to='/app/account'
        />
        <Typography color='textPrimary' variant='h5'>
          {me.userName}
        </Typography>
        <Typography color='textSecondary' variant='body2'>
          {me.idRol}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item: any) => (
            <NavItem
              click={onMobileClose}
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
          <ListItem className={classes.item} disableGutters>
            <Button className={classes.button} onClick={closeSesion}>
              <span className={classes.title}>Salir</span>
            </Button>
          </ListItem>
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor='left'
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant='temporary'
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer anchor='left' classes={{ paper: classes.desktopDrawer }} open variant='persistent'>
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

export default NavBar;
