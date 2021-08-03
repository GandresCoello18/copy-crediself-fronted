/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { Container, makeStyles, Grid } from '@material-ui/core';
import Page from '../components/page';
import { useState, useEffect } from 'react';

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundColor: '#f2f2f2',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const PermisosView = () => {
  const classes = useStyles();
  const [Loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  return (
    <Page className={classes.root} title='Permisos'>
      <Container maxWidth='lg'>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            {Loading ? 'Si' : 'No'}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default PermisosView;
