/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import {
  Container,
  makeStyles,
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import Page from '../components/page';
import { useState, useEffect, useContext } from 'react';
import { TablePermisos } from '../components/Permisos/table-permisos';
import { AxiosError } from 'axios';
import { toast } from 'react-toast';
import { HandleError } from '../helpers/handleError';
import { GetPermisosByRole } from '../api/permisos';
import { MeContext } from '../context/contextMe';
import { PermisosByRol } from '../interfaces/Permiso';
import { Alert, Skeleton } from '@material-ui/lab';

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundColor: '#f2f2f2',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
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

const PermisosView = () => {
  const classes = useStyles();
  const { token } = useContext(MeContext);
  const [Loading, setLoading] = useState<boolean>(false);
  const [PerByRol, setPerByRol] = useState<PermisosByRol[]>([]);
  const [expanded, setExpanded] = useState<string | false>(false);

  console.log(Loading);

  const handleChange = (panel: string, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    const FetchPermisosByRol = async () => {
      setLoading(true);

      try {
        const { permisosByRol } = await (await GetPermisosByRole({ token })).data;
        setPerByRol(permisosByRol);
        setLoading(false);
      } catch (error) {
        toast.error(HandleError(error as AxiosError));
        setLoading(false);
      }
    };

    FetchPermisosByRol();
  }, []);

  const SkeletonPermisos = () => {
    return [0, 1, 2, 3, 4, 5, 6, 7].map(item => (
      <Skeleton key={item} style={{ marginBottom: 10 }} variant='rect' width='100%' height={40} />
    ));
  };

  return (
    <Page className={classes.root} title='Permisos'>
      <Container maxWidth='lg'>
        <Box mt={3}>
          {Loading && SkeletonPermisos()}

          {!Loading && !PerByRol.length && (
            <Alert severity='info'>
              Por el momento no hay <strong>Permisos De Roles</strong> para mostrar.
            </Alert>
          )}

          {!Loading &&
            PerByRol.map(per => (
              <Accordion
                expanded={expanded === per.rol}
                key={per.rol}
                onChange={(event: any, expanded: boolean) => handleChange(per.rol, expanded)}
              >
                <AccordionSummary
                  expandIcon={<PersonPinIcon />}
                  aria-controls='panel1bh-content'
                  id='panel1bh-header'
                >
                  <Typography className={classes.heading}>
                    {per.rol} ({per.permisos.length})
                  </Typography>
                  <Typography className={classes.secondaryHeading}>{per.descripcion}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TablePermisos permisos={per.permisos} />
                </AccordionDetails>
              </Accordion>
            ))}
        </Box>
      </Container>
    </Page>
  );
};

export default PermisosView;
