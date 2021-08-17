/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  Grid,
  Typography,
  makeStyles,
  Box,
  Badge,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  Paper,
  Switch,
  MenuItem,
  Select,
  Button,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import React, { SetStateAction, Dispatch, useState, useContext } from 'react';
import { Link as RouterLink, Link } from 'react-router-dom';
import { CreditoByCliente } from '../../interfaces/Credito';
import { SourceAvatar } from '../../helpers/sourceAvatar';
import { AxiosError } from 'axios';
import { toast } from 'react-toast';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { HandleError } from '../../helpers/handleError';
import { MeContext } from '../../context/contextMe';
import { UpdateActiveCredito, UpdateStatusCredito } from '../../api/credito';
import { BASE_API_FILE_DOCUMENT } from '../../api';

const useStyles = makeStyles(theme => ({
  headDetails: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  backGroundHeadTrue: {
    backgroundColor: theme.palette.success.main,
    color: '#000',
  },
  backGroundHeadFalse: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64,
  },
  title: theme.typography.h4,
  point: {
    cursor: 'pointer',
  },
  rowSecondary: {
    backgroundColor: '#ebebeb',
    marginBottom: 10,
  },
  marginB: {
    marginBottom: 10,
  },
  titleContrato: {
    textAlign: 'center',
    fontSize: 25,
  },
  btnDelete: {
    color: 'red',
    borderColor: 'red',
  },
  btnAutorizar: {
    color: 'green',
    borderColor: 'green',
  },
}));

interface Props {
  credito?: CreditoByCliente;
  setSelectCredito: Dispatch<SetStateAction<CreditoByCliente | undefined>>;
}

export const DetailsCredito = ({ credito, setSelectCredito }: Props) => {
  const clases = useStyles();
  const { token } = useContext(MeContext);
  const [statusCredit, setStatusCredit] = useState<{ loading: boolean; modific: string }>({
    loading: false,
    modific: '',
  });
  const [Loading, setLoading] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(credito?.active ? true : false);

  const handleActive = async (check: boolean) => {
    setLoading(true);

    try {
      await UpdateActiveCredito({ token, active: check, IdCredito: credito?.idCredito || '' });
      setLoading(false);
      setIsActive(check);
    } catch (error) {
      setLoading(false);
      toast.error(HandleError(error as AxiosError));
    }
  };

  const handleStatus = async (status: string) => {
    setStatusCredit({
      ...statusCredit,
      loading: true,
    });

    try {
      await UpdateStatusCredito({ token, status, IdCredito: credito?.idCredito || '' });
      setStatusCredit({
        ...statusCredit,
        modific: status,
        loading: false,
      });
    } catch (error) {
      setStatusCredit({
        ...statusCredit,
        loading: false,
      });
      toast.error(HandleError(error as AxiosError));
    }
  };

  return (
    <Box mb={5}>
      {credito ? (
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            className={`${clases.headDetails} ${
              credito.autorizado && credito.active
                ? clases.backGroundHeadTrue
                : clases.backGroundHeadFalse
            }`}
          >
            <Box display='flex' justifyContent='space-between'>
              <Typography className={clases.title}>Credito #{credito?.numeroCredito}</Typography>
              <Badge className={clases.point} onClick={() => setSelectCredito(undefined)}>
                <VisibilityOffIcon />
              </Badge>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box alignItems='center' display='flex' flexDirection='column' p={2}>
              <Avatar
                className={clases.avatar}
                component={RouterLink}
                src={SourceAvatar('')}
                to={`/app/creditos/cliente/${credito.idCliente}`}
              />
              <Typography color='textPrimary' variant='h5'>
                {credito.cliente.nombres + ' ' + credito.cliente.apellidos}
              </Typography>
              <Typography color='textSecondary' variant='body2'>
                {credito.cliente.email}
              </Typography>
            </Box>
            <Divider />

            <Box p={2}>
              <Grid
                className={clases.rowSecondary}
                alignItems='center'
                container
                spacing={3}
                justify='space-between'
              >
                <Grid item>
                  <strong>Tipo de credito:</strong>
                </Grid>
                <Grid item>{credito.tipo}</Grid>
              </Grid>

              <Grid
                className={`${clases.marginB} ${
                  credito.autorizado && credito.active
                    ? clases.backGroundHeadTrue
                    : clases.backGroundHeadFalse
                }`}
                container
                spacing={3}
                alignItems='center'
                justify='space-between'
              >
                <Grid item>
                  <strong>Monto:</strong>
                </Grid>
                <Grid item>${credito.monto}</Grid>
              </Grid>

              <Grid className={clases.rowSecondary} container spacing={3} justify='space-between'>
                <Grid item>
                  <strong>Bono de apertura:</strong>
                </Grid>
                <Grid item>
                  <Chip color='secondary' label={credito.apertura ? 'Si' : 'No'} />
                </Grid>
              </Grid>

              <Grid
                className={`${clases.marginB} ${
                  credito.autorizado && credito.active
                    ? clases.backGroundHeadTrue
                    : clases.backGroundHeadFalse
                }`}
                container
                alignItems='center'
                spacing={3}
                justify='space-between'
              >
                <Grid item>
                  <strong>Referencia:</strong>
                </Grid>
                <Grid item>{credito.referencia}</Grid>
              </Grid>

              <Grid
                className={clases.rowSecondary}
                alignItems='center'
                container
                spacing={3}
                justify='space-between'
              >
                <Grid item>
                  <strong>Autorizado:</strong>
                </Grid>
                <Grid item>
                  <Chip color='secondary' label={credito.autorizado ? 'Si' : 'No'} />
                </Grid>
              </Grid>

              <Grid
                className={`${clases.marginB} ${
                  credito.autorizado && credito.active
                    ? clases.backGroundHeadTrue
                    : clases.backGroundHeadFalse
                }`}
                container
                spacing={3}
                alignItems='center'
                justify='space-between'
              >
                <Grid item>
                  <strong>Credito numero:</strong>
                </Grid>
                <Grid item>#{credito.numeroCredito}</Grid>
              </Grid>

              <Grid
                className={clases.rowSecondary}
                container
                spacing={3}
                justify='space-between'
                alignItems='center'
              >
                <Grid item>
                  <strong>Activo:</strong>
                </Grid>
                <Grid item>
                  {Loading ? (
                    <CircularProgress color='secondary' />
                  ) : (
                    <Switch
                      checked={isActive || credito?.active ? true : false}
                      onChange={value => handleActive(value.target.checked)}
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  )}
                </Grid>
              </Grid>

              <Grid
                className={`${clases.marginB} ${
                  credito.autorizado && credito.active
                    ? clases.backGroundHeadTrue
                    : clases.backGroundHeadFalse
                }`}
                container
                alignItems='center'
                spacing={3}
                justify='space-between'
              >
                <Grid item>
                  <strong>Estado:</strong> ({statusCredit.modific || credito.estado})
                </Grid>
                <Grid item>
                  {statusCredit.loading ? (
                    <CircularProgress color='secondary' />
                  ) : (
                    <Select
                      style={{ width: 150 }}
                      onChange={event => handleStatus(event.target.value as string)}
                    >
                      <MenuItem value='Pendiente'>Pendiente</MenuItem>
                      <MenuItem value='Al dia'>Al dia</MenuItem>
                      <MenuItem value='Completado'>Completado</MenuItem>
                      <MenuItem value='Atrasado'>Atrasado</MenuItem>
                    </Select>
                  )}
                </Grid>
              </Grid>

              <Grid
                className={clases.rowSecondary}
                alignItems='center'
                container
                spacing={3}
                justify='space-between'
              >
                <Grid item>
                  <strong>Creado el:</strong>
                </Grid>
                <Grid item>{credito.created_at}</Grid>
              </Grid>

              <Grid alignItems='center' container spacing={3} justify='space-between'>
                <Grid item xs={12} className={clases.titleContrato}>
                  <strong>Contratos</strong>
                </Grid>
                <Grid item xs={12}>
                  {credito.contratos.map(contrato => (
                    <>
                      <a
                        target='_blank'
                        rel='noreferrer'
                        href={`${BASE_API_FILE_DOCUMENT}/doc/${contrato.source}`}
                        key={contrato.id_credito_contrato}
                      >
                        <Paper elevation={3}>
                          <Box p={1} textAlign='center'>
                            <InsertDriveFileIcon style={{ fontSize: 40 }} />
                            <br />
                            <strong>Contrato: </strong>
                            <span>{contrato.contrato}</span>
                            <br />
                            <strong>Actualizado el: </strong>
                            <span>{contrato.updated_at}</span>
                          </Box>
                        </Paper>
                      </a>
                      <br />
                    </>
                  ))}
                </Grid>
              </Grid>
            </Box>
            <Box mt={1}>
              <Grid container justify='space-between'>
                <Grid item xs={12} md={3}>
                  <Button
                    disabled={credito.autorizado ? true : false}
                    className={clases.btnAutorizar}
                    fullWidth
                    variant='outlined'
                  >
                    {credito.autorizado ? 'Autorizado' : 'Autorizar'}
                  </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Link to={`/app/creditos/cliente/${credito.idCliente}`}>
                    <Button fullWidth variant='outlined'>
                      Más creditos
                    </Button>
                  </Link>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button className={clases.btnDelete} fullWidth variant='outlined'>
                    Eliminar
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <>
          <img src='../no-data.svg' alt='no data' width='100%' />
          <Alert severity='info'>Seleccione un credito!</Alert>
        </>
      )}
    </Box>
  );
};
