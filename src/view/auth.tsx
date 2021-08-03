/* eslint-disable no-undef */
/* eslint-disable react/react-in-jsx-scope */
import { Container, Box, makeStyles } from '@material-ui/core';
import Page from '../components/page';
import { Login } from '../components/Auth/formLogin';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#f2f2f2',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  center: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export const Auth = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title='Access'>
      <Container maxWidth='md'>
        <Box className={classes.center}>
          <Box justifyContent='center'>
            <Box style={{ textAlign: 'center' }}>
              <Login />
            </Box>
          </Box>
        </Box>
      </Container>
    </Page>
  );
};
