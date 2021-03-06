/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import {
  Container,
  makeStyles,
  Box,
  Card,
  Button,
  Grid,
  CardContent,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import Page from '../components/page';
import { useState, useEffect, useContext } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { MeContext } from '../context/contextMe';
import Pagination from '@material-ui/lab/Pagination';
import { toast } from 'react-toast';
import { AxiosError } from 'axios';
import { HandleError } from '../helpers/handleError';
import DeleteIcon from '@material-ui/icons/Delete';
import { TableUser } from '../components/Usuarios/table-user';
import { UsuarioAsignacion } from '../interfaces/Usuario';
import { DeleteMultiUser, GetUsers } from '../api/users';
import { DialogoForm } from '../components/DialogoForm';
import { FormNewUser } from '../components/Usuarios/new-user';
import { getPermisoExist } from '../helpers/renderViewMainRol';

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
  iconButton: {
    padding: 5,
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
}));

const UsuariosView = () => {
  const classes = useStyles();
  const { token, me } = useContext(MeContext);
  const [SearchUser, setSearchUser] = useState<string>('');
  const [IdsUser, setIdsUser] = useState<string[]>([]);
  const [Usuarios, setUsuarios] = useState<UsuarioAsignacion[]>([]);
  const [Count, setCount] = useState<number>(0);
  const [Visible, setVisible] = useState<boolean>(false);
  const [Loading, setLoading] = useState<boolean>(false);
  const [ReloadUser, setReloadUser] = useState<boolean>(false);
  const [LoadingMulti, setLoadingMulti] = useState<boolean>(false);

  const fetchUsuarios = async (page: number) => {
    setLoading(true);

    try {
      const { users, pages } = await (await GetUsers({ token, page, findUser: SearchUser })).data;
      setUsuarios(users);
      setLoading(false);
      setCount(pages || 1);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  const DeleteMulti = async () => {
    setLoadingMulti(true);

    try {
      await DeleteMultiUser({ token, IdsUser });
      setLoadingMulti(false);
      setIdsUser([]);
      fetchUsuarios(1);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoadingMulti(false);
    }
  };

  useEffect(() => {
    fetchUsuarios(1);

    if (ReloadUser) {
      setReloadUser(false);
    }
  }, [ReloadUser]);

  const SelectItemPagination = (page: number) => fetchUsuarios(page);

  return (
    <Page className={classes.root} title='Usuarios'>
      <Container maxWidth='xl'>
        {getPermisoExist({ RolName: me.idRol, permiso: 'NewUsers' }) ? (
          <Box display='flex' justifyContent='flex-end'>
            <Button color='secondary' variant='contained' onClick={() => setVisible(true)}>
              Nuevo usuario {me.idRol === 'Director' ? 'RRHH' : ''}
            </Button>
          </Box>
        ) : null}
        <Box mt={3}>
          <Card>
            <CardContent>
              <Grid container spacing={3} direction='row' justify='center' alignItems='center'>
                <Grid item xs={12} md={9}>
                  <Box maxWidth={500} display='flex' justifyContent='space-between'>
                    <TextField
                      fullWidth
                      onChange={event => setSearchUser(event.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='start'>
                            <Button
                              color='primary'
                              variant='outlined'
                              disabled={Loading && !Usuarios.length}
                              onClick={() => fetchUsuarios(1)}
                              className={classes.iconButton}
                            >
                              <SearchIcon />
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                      placeholder='Buscar Usuario'
                      variant='outlined'
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  {IdsUser.length ? (
                    <Button
                      size='small'
                      title='Eliminar conjunto de rols'
                      className={classes.btnDelete}
                      variant='contained'
                      disabled={LoadingMulti}
                      onClick={DeleteMulti}
                    >
                      Eliminar &nbsp; <strong> {IdsUser.length} </strong> &nbsp; usuarios{' '}
                      <DeleteIcon />
                    </Button>
                  ) : null}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
        <Box mt={3}>
          <TableUser
            usuarios={Usuarios}
            IdsUser={IdsUser}
            setIdsUser={setIdsUser}
            Loading={Loading}
            setReloadUser={setReloadUser}
          />
        </Box>
        <Box mt={3} display='flex' justifyContent='center'>
          <Pagination
            count={Count}
            color='secondary'
            onChange={(event, page) => SelectItemPagination(page)}
          />
        </Box>
      </Container>

      <DialogoForm Open={Visible} setOpen={setVisible} title=''>
        <FormNewUser setReloadUser={setReloadUser} setVisible={setVisible} />
      </DialogoForm>
    </Page>
  );
};

export default UsuariosView;
