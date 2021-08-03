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
          <img
            src='logo-crediself.png'
            alt='logo crediself'
            width={60}
            style={{ borderRadius: 5, border: '1px solid royalblue' }}
          />
        </RouterLink>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
