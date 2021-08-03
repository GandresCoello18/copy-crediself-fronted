/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Box, Hidden, IconButton, Toolbar } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
import Cookies from 'js-cookie';
import { useContext } from 'react';
import { MeContext } from '../../context/contextMe';
import { RenderMainViewRol } from '../../helpers/renderViewMainRol';

interface Props {
  onMobileNavOpen: () => any;
}

const TopBar = ({ onMobileNavOpen, ...rest }: Props) => {
  const { me } = useContext(MeContext);
  const closeSesion = () => {
    Cookies.remove('access-token-crediself');
    window.location.href = '/login';
  };

  return (
    <AppBar elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to={RenderMainViewRol(me.idRol)}>
          <img
            src='https://res.cloudinary.com/cici/image/upload/v1627948680/util/logo-crediself_jtbifz.png'
            alt='logo de cici'
            width={60}
            style={{ borderRadius: 5, border: '1px solid #fff' }}
          />
        </RouterLink>
        <Box flexGrow={1} />
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
  );
};

export default TopBar;
