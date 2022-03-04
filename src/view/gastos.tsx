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
import { Gastos, GastoStatistics } from '../interfaces/Gastos';
import { GraficoGastos } from '../components/Gastos/grafico-gastos';
import { GetSucursales } from '../api/sucursales';
import { Sucursal } from '../interfaces/Sucursales';
import { FormNewGasto } from '../components/Gastos/new-gastos';

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
  const { token, me } = useContext(MeContext);
  const [SearchGasto, setSearchGasto] = useState<string>('');
  const [idSucursal, setIdSucursal] = useState<string>('');
  const [Gastos, setGastos] = useState<Gastos[]>([]);
  const [Count, setCount] = useState<number>(0);
  const [Statistics, setStatistics] = useState<GastoStatistics | undefined>(undefined);
  const [DataSucursales, setDataSucursales] = useState<Sucursal[]>([]);
  const [Expanded, setExpanded] = useState<boolean>(false);
  const [findDate, setFindDate] = useState<string>('');
  const [Visible, setVisible] = useState<boolean>(false);
  const [Loading, setLoading] = useState<boolean>(false);
  const [ReloadGasto, setReloadGasto] = useState<boolean>(false);

  const fetchGastos = async (page: number) => {
    setLoading(true);

    try {
      const { gastos, statistics, pages } = await (
        await GetExpenses({
          token,
          page,
          findGasto: SearchGasto,
          idSucursal,
          findDate,
          isStatistics: 'true',
        })
      ).data;
      setGastos(gastos);
      setStatistics(statistics);
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
  }, [ReloadGasto, SearchGasto, idSucursal, findDate]);

  const fetchSucursales = async () => {
    try {
      const { sucursales } = await (await GetSucursales({ token, empresa: me.empresa })).data;
      setDataSucursales(sucursales);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
    }
  };

  useEffect(() => {
    fetchSucursales();
  }, []);

  const resetOptions = () => {
    setFindDate('');
    setIdSucursal('');
    setSearchGasto('');
  };

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
                <Grid item xs={12} lg={4} xl={5} style={{ marginRight: 10 }}>
                  <Box maxWidth={500}>
                    <TextField
                      fullWidth
                      title='Buscar Gastos por concepto u observaciones'
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
                <Grid item xs={12} lg={3} xl={2}>
                  <TextField
                    id='date'
                    label='Buscar por Mes'
                    type='month'
                    value={findDate}
                    onChange={event => setFindDate(event.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} lg={3} xl={2}>
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
                <Grid item xs={12} lg={1}>
                  <Button color='secondary' variant='outlined' onClick={resetOptions}>
                    Restablecer
                  </Button>
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
                fechas={Statistics?.fechas}
                gastos={Statistics?.gastos}
                gastosMesAnterior={Statistics?.gastosMesAnterior}
                Loading={Loading}
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
        <FormNewGasto setReloadGasto={setReloadGasto} setVisible={setVisible} />
      </DialogoForm>
    </Page>
  );
};

export default GastosView;
