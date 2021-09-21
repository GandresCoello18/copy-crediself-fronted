/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Button, CircularProgress } from '@material-ui/core';
import { AxiosError } from 'axios';
import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { toast } from 'react-toast';
import { UpdateAllReadNotificacion } from '../../api/notificacion';
import { Link } from 'react-router-dom';
import { MeContext } from '../../context/contextMe';
import { HandleError } from '../../helpers/handleError';

interface Props {
  VisibleViewAll?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
  setReloadNotificacion: Dispatch<SetStateAction<boolean>>;
}

export const ActionNotification = ({
  VisibleViewAll = true,
  setOpen,
  disabled,
  setReloadNotificacion,
}: Props) => {
  const { token } = useContext(MeContext);
  const [Loading, setLoading] = useState<boolean>(false);

  const handleReadAll = async () => {
    setLoading(true);

    try {
      await UpdateAllReadNotificacion({ token });
      setLoading(false);
      setReloadNotificacion(true);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoading(false);
    }
  };

  return (
    <Box p={3} display='flex' justifyContent='space-between'>
      <Button disabled={disabled} style={{ fontSize: 12 }} onClick={handleReadAll}>
        {Loading ? <CircularProgress color='secondary' /> : 'Marcar todas como leidas'}
      </Button>
      {VisibleViewAll ? (
        <Link to='/app/notificaciones' onClick={() => setOpen && setOpen(false)}>
          <Button style={{ fontSize: 12 }}>Ver todas</Button>
        </Link>
      ) : (
        ''
      )}
    </Box>
  );
};
