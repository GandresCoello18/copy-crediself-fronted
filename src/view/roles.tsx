/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import {
  Container,
  makeStyles,
  Box,
  Grid,
  Card,
  Button,
  CardContent,
  InputAdornment,
  SvgIcon,
  TextField,
} from '@material-ui/core';
import Page from '../components/page';
import { useState, useEffect, useContext } from 'react';
import { DeleteMultiRole, GetRoles } from '../api/roles';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import { MeContext } from '../context/contextMe';
import { toast } from 'react-toast';
import { Rol } from '../interfaces/Rol';
import { TableRol } from '../components/Roles/table-rol';
import { AxiosError } from 'axios';
import { HandleError } from '../helpers/handleError';

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundColor: '#f2f2f2',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  btnDelete: {
    backgroundColor: theme.palette.error.main,
  },
}));

const RolesView = () => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [SearchRoles, setSearchRoles] = useState<string>('');
  const [IdsRole, setIdsRole] = useState<string[]>([]);
  const [Roles, setRoles] = useState<Rol[]>([]);
  const [Loading, setLoading] = useState<boolean>(false);
  const [LoadingMulti, setLoadingMulti] = useState<boolean>(false);
  const [ReloadRol, setReloadRol] = useState<boolean>(false);

  const fetchRoles = async () => {
    setLoading(true);

    try {
      const { roles } = await (await GetRoles({ token })).data;
      setRoles(roles);
      setLoading(false);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (ReloadRol) {
      setReloadRol(false);
      fetchRoles();
    }
  }, [ReloadRol]);

  const DeleteMulti = async () => {
    setLoadingMulti(true);

    try {
      await DeleteMultiRole({ token, IdsRole });
      setLoadingMulti(false);
      setIdsRole([]);
      fetchRoles();
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoadingMulti(false);
    }
  };

  return (
    <Page className={classes.root} title='Roles'>
      <Container maxWidth='lg'>
        <Box mt={3}>
          <Card>
            <CardContent>
              <Grid container spacing={3} direction='row' justify='center' alignItems='center'>
                <Grid item xs={12} md={9}>
                  <Box maxWidth={500}>
                    <TextField
                      fullWidth
                      onChange={event => setSearchRoles(event.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <SvgIcon fontSize='small' color='action'>
                              <SearchIcon />
                            </SvgIcon>
                          </InputAdornment>
                        ),
                      }}
                      placeholder='Buscar rol'
                      variant='outlined'
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  {IdsRole.length ? (
                    <Button
                      size='small'
                      title='Eliminar conjunto de rols'
                      className={classes.btnDelete}
                      variant='contained'
                      disabled={LoadingMulti}
                      onClick={DeleteMulti}
                    >
                      Eliminar &nbsp; <strong> {IdsRole.length} </strong> &nbsp; roles{' '}
                      <DeleteIcon />
                    </Button>
                  ) : (
                    ''
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
        <Box mt={3}>
          <TableRol
            SearchRoles={SearchRoles || ''}
            roles={Roles}
            IdsRole={IdsRole}
            setIdsRole={setIdsRole}
            Loading={Loading}
            setReloadRol={setReloadRol}
          />
        </Box>
      </Container>
    </Page>
  );
};

export default RolesView;
