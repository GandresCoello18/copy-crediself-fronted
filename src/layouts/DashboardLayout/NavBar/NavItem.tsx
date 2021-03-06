/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { NavLink as RouterLink } from 'react-router-dom';
import { Button, ListItem, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    color: theme.palette.text.secondary,
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    letterSpacing: 0,
    padding: '10px 8px',
    textTransform: 'none',
    width: '100%',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  title: {
    marginRight: 'auto',
  },
  active: {
    color: theme.palette.primary.main,
    '& $title': {
      fontWeight: theme.typography.fontWeightMedium,
    },
    '& $icon': {
      color: theme.palette.primary.main,
    },
  },
}));

interface Props {
  click: () => void;
  href: string;
  icon: any;
  id: string;
  title: string;
}

const NavItem = ({ click, href, icon: Icon, id, title, ...rest }: Props) => {
  const classes = useStyles();

  return (
    <ListItem className={classes.item} disableGutters {...rest}>
      <Button
        onClick={() => click()}
        //activeClassName={classes.active}
        className={classes.button}
        id={id}
        component={RouterLink}
        to={href}
      >
        {Icon && <Icon className={classes.icon} size='20' />}
        <span className={classes.title}>{title}</span>
      </Button>
    </ListItem>
  );
};

export default NavItem;
