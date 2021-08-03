import { Button } from '@material-ui/core';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MeContext } from '../context/contextMe';
import { RenderMainViewRol } from '../helpers/renderViewMainRol';

/* eslint-disable react/react-in-jsx-scope */
export const NotFound = () => {
  const { me } = useContext(MeContext);
  return (
    <div style={{ textAlign: 'center', marginTop: 30 }}>
      <img src='not-found.png' alt='Imagen 404' />
      <br />
      <Link to={me.idRol ? RenderMainViewRol(me.idRol) : '/login'}>
        <Button color='secondary' variant='contained'>
          Volver a un lugar seguro
        </Button>
      </Link>
    </div>
  );
};
