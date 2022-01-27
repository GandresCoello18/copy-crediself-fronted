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
  Grid,
  makeStyles,
  SvgIcon,
  TextField,
  Button,
} from '@material-ui/core';
import Page from '../components/page';
import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toast';
import { MeContext } from '../context/contextMe';
import { AxiosError } from 'axios';
import SearchIcon from '@material-ui/icons/Search';
import { HandleError } from '../helpers/handleError';
import { Alert, Pagination, Skeleton } from '@material-ui/lab';
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
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export interface FetchByDate {
  dateDesde: string;
  dateHasta: string;
}

export interface FilterCancelacion {
  dateInit: string | undefined;
  dateEnd: string;
}

const CancelacionesView = () => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [Loading, setLoading] = useState<boolean>(false);
  const [Count, setCount] = useState<number>(0);
  const [Search, setSearch] = useState<string>('');
  const [Filter, setFilter] = useState<FilterCancelacion>({
    dateInit: 'dd/mm/aaaa',
    dateEnd: 'dd/mm/aaaa',
  });
  const [Cancelaciones, setCancelaciones] = useState<CancelacionByDetails[]>([]);

  const fetchCancelaciones = async (page: number) => {
    setLoading(true);

    try {
      const { dateInit, dateEnd } = Filter;
      const { cancelaciones, pages } = await (
        await GetCancelaciones({ token, page, dateInit, dateEnd, find: Search })
      ).data;

      setCancelaciones(cancelaciones);
      setLoading(false);
      setCount(pages || 1);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  const ValidDate = (isEffect?: boolean) => {
    const { dateEnd, dateInit } = Filter;
    if (!dateEnd && !dateInit) {
      return false;
    }

    if (dateEnd === 'dd/mm/aaaa' && dateInit === 'dd/mm/aaaa') {
      return false;
    }

    if (isEffect && (dateEnd === 'dd/mm/aaaa' || dateInit === 'dd/mm/aaaa')) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    fetchCancelaciones(1);
  }, [Search]);

  useEffect(() => {
    ValidDate(true) && fetchCancelaciones(1);
  }, [Filter]);

  const SkeletonPlaceHolder = () => {
    return [0, 1, 2, 3, 4, 5, 6, 7].map(item => (
      <Skeleton key={item} style={{ marginBottom: 10 }} variant='rect' width='100%' height={40} />
    ));
  };

  const SelectItemPagination = (page: number) => console.log(page);

  const ClearFIlter = () => {
    setFilter({
      dateInit: 'dd/mm/aaaa',
      dateEnd: 'dd/mm/aaaa',
    });

    if (!Search) {
      fetchCancelaciones(1);
    }

    setSearch('');
  };

  return (
    <Page className={classes.root} title='Cancelaciones'>
      <Container maxWidth='xl'>
        <Box mt={3}>
          <Card>
            <CardContent>
              <Box alignItems='center'>
                <Grid container spacing={3} justify='space-between'>
                  <Grid item xs={12} md={5}>
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
                  </Grid>
                  <Grid item>
                    <Box>
                      <TextField
                        id='Desde'
                        label='Desde'
                        type='date'
                        defaultValue={Filter.dateInit}
                        value={Filter.dateInit}
                        onChange={event => setFilter({ ...Filter, dateInit: event.target.value })}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />

                      <TextField
                        id='Hasta'
                        label='Hasta'
                        disabled={!ValidDate()}
                        type='date'
                        defaultValue={Filter.dateEnd}
                        value={Filter.dateEnd}
                        onChange={event => setFilter({ ...Filter, dateEnd: event.target.value })}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />

                      {ValidDate() && (
                        <Button variant='outlined' onClick={ClearFIlter}>
                          Limpiar
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box mt={3}>
          {Loading && SkeletonPlaceHolder()}
          {!Loading && !Cancelaciones.length && (
            <Alert severity='info'>
              Por el momento no hay <strong>Cancelaciones</strong> para mostrar.
            </Alert>
          )}
          {!Loading &&
            Cancelaciones.map(can => (
              <ItemCreditoCancelado cancelacion={can} key={can.idCancelacion} />
            ))}
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
