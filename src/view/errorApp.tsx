/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  InputAdornment,
  makeStyles,
  SvgIcon,
  TextField,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { AxiosError } from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toast';
import { GetErrorApp } from '../api/errores';
import SearchIcon from '@material-ui/icons/Search';
import Page from '../components/page';
import { MeContext } from '../context/contextMe';
import { HandleError } from '../helpers/handleError';
import { ErrorAppByUser } from '../interfaces/Error';
import { TablaError } from '../components/Error/table-error';
import { DialogoForm } from '../components/DialogoForm';
import { FormNewProblema } from '../components/Error/new-error';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#f2f2f2',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const ErrorAppView = () => {
  const classes = useStyles();
  const [Count, setCount] = useState<number>(0);
  const [Loading, setLoading] = useState<boolean>(false);
  const [Visible, setVisible] = useState<boolean>(false);
  const [Error, setError] = useState<ErrorAppByUser[]>([]);
  const [ReloadError, setReloadError] = useState<boolean>(false);
  const [SearchError, setSearchError] = useState<string>('');
  const { token } = useContext(MeContext);

  const fetchReportes = async (page: number) => {
    try {
      const { reportesErrores, pages } = await (
        await GetErrorApp({ token, page, findError: SearchError })
      ).data;

      setError(reportesErrores);
      setCount(pages || 1);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportes(1);

    if (ReloadError) {
      setReloadError(false);
    }
  }, [ReloadError]);

  const SelectItemPagination = (page: number) => fetchReportes(page);
  return (
    <Page className={classes.root} title='Reporte de Problemas'>
      <Container maxWidth='xl'>
        <Box display='flex' justifyContent='flex-end'>
          <Button color='secondary' variant='contained' onClick={() => setVisible(true)}>
            Reportar Problema
          </Button>
        </Box>
        <Box mt={3}>
          <Card>
            <CardContent>
              <Box maxWidth={500}>
                <TextField
                  fullWidth
                  onChange={event => setSearchError(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SvgIcon fontSize='small' color='action'>
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder='Buscar Error por asunto o descripcion'
                  variant='outlined'
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box mt={3}>
          <TablaError setReloadError={setReloadError} reportesError={Error} Loading={Loading} />
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
        <FormNewProblema setReloadError={setReloadError} setVisible={setVisible} />
      </DialogoForm>
    </Page>
  );
};

export default ErrorAppView;
