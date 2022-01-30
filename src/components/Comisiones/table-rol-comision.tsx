/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  TableRow,
  TableCell,
  Chip,
  Button,
  Avatar,
  makeStyles,
  Box,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { SourceAvatar } from '../../helpers/sourceAvatar';
import { MisComisiones } from '../../interfaces/Comision';
import getInitials from '../../util/getInitials';

interface Props {
  comision: MisComisiones;
  children: JSX.Element;
}

const useStyles = makeStyles(theme => ({
  avatar: {
    marginRight: theme.spacing(2),
  },
}));

export const RowTableComision = ({ comision, children }: Props) => {
  const clases = useStyles();

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Box alignItems='center' display='flex'>
            <Avatar className={clases.avatar} src={SourceAvatar(comision.user.avatar)}>
              {getInitials(comision.user.nombres)}
            </Avatar>
            <Typography color='textPrimary' variant='body1'>
              {comision.user.nombres} {comision.user.apellidos}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>{comision.comisionType || <Chip color='primary' label='None' />}</TableCell>
        <TableCell>{comision.mesComision}</TableCell>
        <TableCell>{comision.porcentaje || 0}%</TableCell>
        <TableCell>{comision.fechaHaPagar}</TableCell>
        <TableCell>{comision.status}</TableCell>
        <TableCell>${comision.total}</TableCell>
        <TableCell>{children}</TableCell>
      </TableRow>
    </>
  );
};
