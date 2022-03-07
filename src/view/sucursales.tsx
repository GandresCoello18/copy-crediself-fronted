/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/react-in-jsx-scope */
import {
  Container,
  makeStyles,
  Box,
  Grid,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Avatar,
  Card,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import Page from '../components/page';
import { useState, useEffect, useContext } from 'react';
import { MeContext } from '../context/contextMe';
import { toast } from 'react-toast';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import { AxiosError } from 'axios';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { HandleError } from '../helpers/handleError';
import { Skeleton } from '@material-ui/lab';
import { SucursalByUser } from '../interfaces/Sucursales';
import Alert from '@material-ui/lab/Alert';
import { GetSucursalesByUser } from '../api/sucursales';
import { SourceAvatar } from '../helpers/sourceAvatar';
import { Usuario } from '../interfaces/Usuario';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#f2f2f2',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  btnDelete: {
    backgroundColor: theme.palette.error.main,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
    fontWeight: 'bold',
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

const SucursalesView = () => {
  const classes = useStyles();
  const { token, me } = useContext(MeContext);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [SucursalesByUser, setSucursalesByUser] = useState<SucursalByUser[]>([]);
  const [Loading, setLoading] = useState<boolean>(false);

  const handleChange = (panel: string, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const fetchSucursales = async () => {
    setLoading(true);

    try {
      const { sucursales } = await (await GetSucursalesByUser({ token, empresa: me.empresa })).data;
      setSucursalesByUser(sucursales);
      setLoading(false);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSucursales();
  }, []);

  const SkeletonCardComision = () => {
    return (
      <Grid spacing={3} container justify='center' direction='row' alignItems='center'>
        {[0, 1, 2, 3, 4].map(item => (
          <Grid item key={item}>
            <Skeleton style={{ marginBottom: 10 }} variant='rect' width={350} height={190} />
          </Grid>
        ))}
      </Grid>
    );
  };

  const RenderUser = (user: Usuario) => (
    <>
      <Card>
        <CardHeader
          avatar={<Avatar aria-label='recipe' src={SourceAvatar(user.avatar || '')} />}
          action={
            <IconButton onClick={handleOpenMenu} aria-controls='simple-menu' aria-label='settings'>
              <MoreVertIcon />
            </IconButton>
          }
          title={`${user.nombres} ${user.apellidos}`}
          subheader={user.idRol}
        />
      </Card>

      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
          <Link target='_blank' to={`/app/creditos/user/${user.idUser}`}>
            Ventas
          </Link>
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <Link target='_blank' to={`/app/clientes/user/${user.idUser}`}>
            Clientes
          </Link>
        </MenuItem>
      </Menu>
    </>
  );

  return (
    <Page className={classes.root} title={`Sucursales de ${me.empresa}`}>
      <Container maxWidth='lg'>
        <Box mt={3}>
          {Loading && SkeletonCardComision()}
          <br />

          {!Loading &&
            SucursalesByUser.map(sucursal => (
              <Accordion
                expanded={expanded === sucursal.idSucursal}
                key={sucursal.idSucursal}
                onChange={(event: any, expanded: boolean) =>
                  handleChange(sucursal.idSucursal, expanded)
                }
              >
                <AccordionSummary
                  expandIcon={<PersonPinIcon />}
                  aria-controls='panel1bh-content'
                  id='panel1bh-header'
                >
                  <Typography className={classes.heading}>{sucursal.sucursal}</Typography>
                  <Typography className={classes.secondaryHeading}>{sucursal.direccion}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    {!sucursal.users.length && (
                      <Grid item xs={12}>
                        <Alert severity='info'>
                          No hay usuarios (Supervisor, Asesor o Gerente de sucursal)
                        </Alert>
                      </Grid>
                    )}
                    {sucursal.users.map(user => (
                      <Grid item key={user.idUser}>
                        {RenderUser(user)}
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
        </Box>
      </Container>
    </Page>
  );
};

export default SucursalesView;
