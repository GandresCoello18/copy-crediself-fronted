/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from 'react';
import { Card, Typography, makeStyles, Button, Box, Grid, TextField } from '@material-ui/core';
import { Comision } from '../../interfaces/Comision';

const useStyles = makeStyles(theme => ({
  card: {
    padding: 20,
  },
  title: {
    fontSize: 25,
    color: theme.palette.primary.main,
    textAlign: 'center',
    marginBottom: 10,
  },
  btnActualizar: {
    marginRight: 5,
    background: theme.palette.warning.main,
    color: '#000',
  },
  btnCancel: {
    marginLeft: 5,
    background: theme.palette.error.main,
    color: '#000',
  },
}));

interface Props {
  comision: Comision;
  UpdatePorcentaje: (idComision: string, porciento: number) => Promise<void>;
}

export const CardComision = ({ comision, UpdatePorcentaje }: Props) => {
  const [Loading, setLoading] = useState<boolean>(false);
  const [ChangePorciento, setChangePorciento] = useState<number>(comision.porcentaje);
  const [IsChange, setIsChange] = useState<boolean>(false);
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      {IsChange ? (
        <Box justifyContent='center' alignItems='center' display='flex'>
          <TextField
            id='outlined-basic'
            className={classes.title}
            disabled={Loading}
            type='number'
            onChange={event => setChangePorciento(Number(event.target.value))}
            defaultValue={ChangePorciento}
            label='Porcentaje'
            variant='outlined'
          />
        </Box>
      ) : (
        <Typography className={classes.title}>
          {comision.comisionType} {ChangePorciento || comision.porcentaje}%
        </Typography>
      )}
      <p>
        Rol: <strong>{comision.idRol}</strong>
      </p>
      <br />
      <p>{comision.descripcion}</p>

      <br />

      <Grid container direction='row' justify='space-between'>
        <Grid item xs={IsChange ? 6 : 12}>
          <Button
            disabled={Loading}
            onClick={() => {
              if (IsChange) {
                setLoading(true);
                UpdatePorcentaje(comision.idComision, ChangePorciento)
                  .then(() => {
                    setLoading(false);
                    setIsChange(false);
                  })
                  .catch(() => setLoading(false));
              } else {
                setIsChange(true);
              }
            }}
            fullWidth
            className={classes.btnActualizar}
          >
            Actualizar
          </Button>
        </Grid>
        {IsChange && (
          <Grid item xs={6}>
            <Button
              disabled={Loading}
              onClick={() => setIsChange(false)}
              fullWidth
              className={classes.btnCancel}
            >
              Cancelar
            </Button>
          </Grid>
        )}
      </Grid>
    </Card>
  );
};
