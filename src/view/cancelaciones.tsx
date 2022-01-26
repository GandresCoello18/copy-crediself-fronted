/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import {
  Box,
  Card,
  CardContent,
  Container,
  InputAdornment,
  makeStyles,
  SvgIcon,
  TextField,
} from '@material-ui/core';
import Page from '../components/page';
import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toast';
import { MeContext } from '../context/contextMe';
import { AxiosError } from 'axios';
import SearchIcon from '@material-ui/icons/Search';
import { HandleError } from '../helpers/handleError';
import { Pagination, Skeleton } from '@material-ui/lab';
import { GetCancelaciones } from '../api/cancelacion';
import { ItemCreditoCancelado } from '../components/Cancelacionn/item-credito-cancelado';
import { CancelacionByDetails } from '../interfaces/Cancelacion';

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundColor: '#f2f2f2',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

export interface FetchByDate {
  dateDesde: string;
  dateHasta: string;
}

const CancelacionesView = () => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [Loading, setLoading] = useState<boolean>(false);
  const [Count, setCount] = useState<number>(0);
  const [Search, setSearch] = useState<string>('');
  const [Cancelaciones, setCancelaciones] = useState<CancelacionByDetails[]>([]);

  const fetchCancelaciones = async (page: number) => {
    setLoading(true);

    try {
      const { cancelaciones, pages } = await (
        await GetCancelaciones({ token, page, dateInit: '', dateEnd: '' })
      ).data;
      setCancelaciones(cancelaciones);
      setLoading(false);
      setCount(pages || 1);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    token && fetchCancelaciones(1);
  }, [token, Search]);

  const SkeletonPlaceHolder = () => {
    return [0, 1, 2, 3, 4, 5, 6, 7].map(item => (
      <Skeleton key={item} style={{ marginBottom: 10 }} variant='rect' width='100%' height={40} />
    ));
  };

  const SelectItemPagination = (page: number) => console.log(page);

  return (
    <Page className={classes.root} title='Cancelaciones'>
      <Container maxWidth='xl'>
        <Box mt={3}>
          <Card>
            <CardContent>
              <Box maxWidth={500}>
                <TextField
                  fullWidth
                  onChange={event => setSearch(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SvgIcon fontSize='small' color='action'>
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder='Buscar por cliente'
                  variant='outlined'
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box mt={3}>
          {Loading && SkeletonPlaceHolder()}
          {!Loading && Cancelaciones.map(can => <ItemCreditoCancelado key={can.idCancelacion} />)}
        </Box>
        <Box mt={3} display='flex' justifyContent='center'>
          <Pagination
            count={Count}
            color='secondary'
            onChange={(event, page) => SelectItemPagination(page)}
          />
        </Box>
      </Container>
    </Page>
  );
};

export default CancelacionesView;
