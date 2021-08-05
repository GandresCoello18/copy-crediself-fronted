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
  CardContent,
  InputAdornment,
  SvgIcon,
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
import { TableUser } from '../components/Usuarios/table-user';
import { Usuario } from '../interfaces/Usuario';
import { GetUsers } from '../api/users';
import { DialogoForm } from '../components/DialogoForm';
import { FormNewUser } from '../components/Usuarios/new-user';

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

const UsuariosView = () => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [SearchUser, setSearchUser] = useState<string>('');
  const [IdsUser, setIdsUser] = useState<string[]>([]);
  const [Usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [Count, setCount] = useState<number>(0);
  const [Visible, setVisible] = useState<boolean>(false);
  const [Loading, setLoading] = useState<boolean>(false);
  const [ReloadUser, setReloadUser] = useState<boolean>(false);

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

  useEffect(() => {
    fetchUsuarios(1);

    if (ReloadUser) {
      setReloadUser(false);
    }
  }, [ReloadUser, SearchUser]);

  const SelectItemPagination = (page: number) => fetchUsuarios(page);

  return (
    <Page className={classes.root} title='Usuarios'>
      <Container maxWidth='lg'>
        <Box display='flex' justifyContent='flex-end'>
          <Button color='secondary' variant='contained' onClick={() => setVisible(true)}>
            Nuevo usuario
          </Button>
        </Box>
        <Box mt={3}>
          <Card>
            <CardContent>
              <Box maxWidth={500}>
                <TextField
                  fullWidth
                  onChange={event => setSearchUser(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SvgIcon fontSize='small' color='action'>
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder='Buscar Usuario'
                  variant='outlined'
                />
              </Box>
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
