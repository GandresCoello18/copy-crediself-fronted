/* eslint-disable react/react-in-jsx-scope */
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {},
  toolbar: {
    height: 64,
  },
});

const TopBar = () => {
  const classes = useStyles();

  return (
    <AppBar>
      <Toolbar className={classes.toolbar}>
        <RouterLink to='/'>
          {localStorage.getItem('empresa-hass-user')?.includes('CREDISELF') ? (
            <img
              src='https://res.cloudinary.com/cici/image/upload/v1627948680/util/logo-crediself_jtbifz.png'
              alt='logo crediself'
              title='logo crediself'
              width={60}
              style={{ borderRadius: 5, border: '1px solid royalblue' }}
            />
          ) : null}

          {localStorage.getItem('empresa-hass-user')?.includes('AUTOIMPULZADORA') ? (
            <img
              src='https://res.cloudinary.com/cici/image/upload/v1629240101/util/WhatsApp_Image_2021-03-04_at_2.09.52_PM_2_mvg89p.jpg'
              alt='logo auto impulsadora'
              title='logo auto impulsadora'
              width={60}
              style={{ borderRadius: 5, border: '1px solid royalblue' }}
            />
          ) : null}

          {!localStorage.getItem('empresa-hass-user') ? (
            <img
              src='./placeholder-picture.png'
              alt='sin logo'
              title='sin logo'
              width={60}
              style={{ borderRadius: 5, border: '1px solid royalblue' }}
            />
          ) : null}
        </RouterLink>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
