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
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import Page from '../components/page';
import { useState, useEffect, useContext } from 'react';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import SearchIcon from '@material-ui/icons/Search';
import { MeContext } from '../context/contextMe';
import Pagination from '@material-ui/lab/Pagination';
import { toast } from 'react-toast';
import { AxiosError } from 'axios';
import { HandleError } from '../helpers/handleError';
import { DialogoForm } from '../components/DialogoForm';
import { GetExpenses } from '../api/caja-chica';
import { TablaGastos } from '../components/Gastos/table-gastos';
import { Gastos } from '../interfaces/Gastos';
import { GraficoGastos } from '../components/Gastos/grafico-gastos';
import { GetSucursales } from '../api/sucursales';
import { Sucursal } from '../interfaces/Sucursales';

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

const GastosView = () => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [SearchGasto, setSearchGasto] = useState<string>('');
  const [idSucursal, setIdSucursal] = useState<string>('');
  const [Gastos, setGastos] = useState<Gastos[]>([]);
  const [Count, setCount] = useState<number>(0);
  const [DataSucursales, setDataSucursales] = useState<Sucursal[]>([]);
  const [Expanded, setExpanded] = useState<boolean>(false);
  const [DateFetch, setDateFetch] = useState<string>('');
  const [Visible, setVisible] = useState<boolean>(false);
  const [Loading, setLoading] = useState<boolean>(false);
  const [ReloadGasto, setReloadGasto] = useState<boolean>(false);

  const fetchGastos = async (page: number) => {
    console.log(DateFetch + ' consultar por mes');
    setLoading(true);

    try {
      const { gastos, pages } = await (
        await GetExpenses({ token, page, findGasto: SearchGasto, idSucursal })
      ).data;
      setGastos(gastos);
      setLoading(false);
      setCount(pages || 1);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGastos(1);

    if (ReloadGasto) {
      setReloadGasto(false);
    }
  }, [ReloadGasto, SearchGasto, idSucursal]);

  const fetchSucursales = async () => {
    try {
      const { sucursales } = await (await GetSucursales({ token })).data;
      setDataSucursales(sucursales);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
    }
  };

  useEffect(() => {
    fetchSucursales();
  }, []);

  const SelectItemPagination = (page: number) => fetchGastos(page);

  return (
    <Page className={classes.root} title='Gastos'>
      <Container maxWidth='xl'>
        <Box display='flex' justifyContent='flex-end'>
          <Button color='secondary' variant='contained' onClick={() => setVisible(true)}>
            Añadir Gastos
          </Button>
        </Box>
        <Box mt={3}>
          <Card>
            <CardContent>
              <Grid container>
                <Grid item xs={12} md={5}>
                  <Box maxWidth={500}>
                    <TextField
                      fullWidth
                      onChange={event => setSearchGasto(event.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <SvgIcon fontSize='small' color='action'>
                              <SearchIcon />
                            </SvgIcon>
                          </InputAdornment>
                        ),
                      }}
                      placeholder='Buscar Gastos por concepto u observaciones'
                      variant='outlined'
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    id='date'
                    label='Buscar por Mes'
                    type='month'
                    onChange={event => setDateFetch(event.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <InputLabel id='select-sucursales'>Sucursales</InputLabel>
                  <Select
                    labelId='select-sucursales'
                    style={{ width: 200 }}
                    id='select-sucursales'
                    onChange={event => setIdSucursal(event.target.value as string)}
                  >
                    {DataSucursales.map(sucursal => (
                      <MenuItem key={sucursal.idSucursal} value={sucursal.idSucursal}>
                        {sucursal.sucursal}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
        <Box mt={3}>
          <Accordion square expanded={Expanded} onChange={() => setExpanded(!Expanded)}>
            <AccordionSummary aria-controls='panel1d-content' id='panel1d-header'>
              <Typography>
                <EqualizerIcon /> Estadisticas de gastos
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <GraficoGastos
                fechas={[
                  '2020-01-05',
                  '2020-01-05',
                  '2020-01-05',
                  '2020-01-05',
                  '2020-01-05',
                  '2020-01-05',
                  '2020-01-05',
                  '2020-01-05',
                ]}
                gastos={[45, 80, 12, 47, 0, 0, 0, 0, 0]}
                gastosMesAnterior={[81, 56, 48, 30, 70, 10, 84, 60]}
                Loading={false}
              />
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box mt={3}>
          <TablaGastos gastos={Gastos} Loading={Loading} setReloadGasto={setReloadGasto} />
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
        new
      </DialogoForm>
    </Page>
  );
};

export default GastosView;
