/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { Navigate, useRoutes } from 'react-router-dom';
import { NotFound } from '../view/NotFound';
import { Suspense, lazy, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import MainLayout from '../layouts/MainLayout';
import Cookies from 'js-cookie';
import { ThemeProvider } from '@material-ui/styles';
import GlobalStyles from '../components/GlobalStyles';
import theme from '../theme';
import { Auth } from '../view/auth';
import { LazyExoticComponent, useContext, useEffect } from 'react';
import { GetMeUser } from '../api/users';
import ConfirmDataClient from '../view/confirm-data-client';
import { MeContext } from '../context/contextMe';
import { toast, ToastContainer } from 'react-toast';
import { ResetPassword } from '../view/reset-password';
import { RestaurarCuenta } from '../view/reset-password-idTime';
import { AxiosError } from 'axios';
import { HandleError } from '../helpers/handleError';
import { RenderMainViewRol } from '../helpers/renderViewMainRol';
import { Box, CircularProgress } from '@material-ui/core';

// import dinamic
const PermisosView = lazy(() => import('../view/permisos'));
const ComisionesView = lazy(() => import('../view/comisiones'));
const MisComisionesView = lazy(() => import('../view/mis-comision'));
const ComisionUser = lazy(() => import('../view/id-comision-by-user'));
const AccountView = lazy(() => import('../view/account'));
const CancelacionesView = lazy(() => import('../view/cancelaciones'));
const CancelacionView = lazy(() => import('../view/cancelacion-id'));
const RolesView = lazy(() => import('../view/roles'));
const UsuariosView = lazy(() => import('../view/usuarios'));
const AsesoresView = lazy(() => import('../view/asesores'));
const NotificacionesView = lazy(() => import('../view/notificacion'));
const ClientesView = lazy(() => import('../view/clientes'));
const ClientesByUserView = lazy(() => import('../view/clientes-user-id'));
const ClienteOnlyView = lazy(() => import('../view/cliente-id'));
const ClientesAcreditacionView = lazy(() => import('../view/clientes-acreditacion'));
const CreditosView = lazy(() => import('../view/creditos'));
const CreditoOnlyView = lazy(() => import('../view/credito-id'));
const CreditosByUserView = lazy(() => import('../view/credito-user-id'));
const CreditoClienteOnlyView = lazy(() => import('../view/credito-cliente-id'));
const SucursalesView = lazy(() => import('../view/sucursales'));
const GastosView = lazy(() => import('../view/gastos'));
const PagosView = lazy(() => import('../view/pagos'));
const PagosByCreditoView = lazy(() => import('../view/pagos-credito'));
const CalendarioView = lazy(() => import('../view/calendar'));
const ErrorAppView = lazy(() => import('../view/errorApp'));

const token = Cookies.get('access-token-crediself');

const AllRols = [
  'Director',
  'Referencia',
  'Supervisor',
  'Administrativo',
  'RRHH',
  'Asesor',
  'Gerente Regional',
  'Cobranza',
  'Gerente de Sucursal',
];

// En el transcurso de tiempo que se consulta que rol soy, aparece una pantalla preload.

const RenderPathLoanding = () => {
  return [
    {
      path: 'app',
      element: <MainLayout />,
      children: [
        {
          path: '*',
          element: (
            <Box
              display='flex'
              style={{ height: '100%' }}
              alignItems='center'
              justifyContent='center'
              p={2}
            >
              <CircularProgress color='secondary' /> &nbsp; Cargando ...
            </Box>
          ),
        },
      ],
    },
  ];
};

// Rutas protegidas dependiendo del rol que lo use.

const RenderRouter = (rol: string) => {
  const PathSesion = (
    Componente: LazyExoticComponent<() => JSX.Element>,
    rolesAllowed: string[],
  ) => {
    const findRol = rolesAllowed.some(rolAw => rolAw === rol);

    if (findRol) {
      return <Componente />;
    } else {
      return <Navigate to={`${RenderMainViewRol(rol)}`} />;
    }
  };

  const NotPathSesion = (Componente: () => JSX.Element) => {
    return token ? <Navigate to='/app/account' /> : <Componente />;
  };

  return [
    {
      path: 'app',
      element: <DashboardLayout />,
      children: [
        {
          path: 'mis-comisiones',
          element: PathSesion(MisComisionesView, [
            'Supervisor',
            'Referencia',
            'Asesor',
            'Administrativo',
          ]),
        },
        {
          path: 'comision-user/:idComisionUser',
          element: PathSesion(ComisionUser, ['Administrativo']),
        },
        { path: 'comisiones', element: PathSesion(ComisionesView, ['Director']) },
        { path: 'permisos', element: PathSesion(PermisosView, ['Director']) },
        { path: 'roles', element: PathSesion(RolesView, ['Director']) },
        { path: 'account', element: PathSesion(AccountView, AllRols) },
        {
          path: 'clientes',
          element: PathSesion(ClientesView, [
            'Supervisor',
            'Asesor',
            'Gerente de Sucursal',
            'Administrativo',
          ]),
        },
        {
          path: 'clientes/:idCliente',
          element: PathSesion(ClienteOnlyView, [
            'Director',
            'Administrativo',
            'Supervisor',
            'Asesor',
            'Gerente de Sucursal',
          ]),
        },
        {
          path: 'clientes/user/:idUser',
          element: PathSesion(ClientesByUserView, [
            'Director',
            'Administrativo',
            'Supervisor',
            'Asesor',
            'Gerente de Sucursal',
          ]),
        },
        {
          path: 'clientes-acreditacion',
          element: PathSesion(ClientesAcreditacionView, ['Director', 'Administrativo']),
        },
        {
          path: 'creditos',
          element: PathSesion(CreditosView, ['Administrativo', 'Gerente de Sucursal']),
        },
        { path: 'cancelaciones', element: PathSesion(CancelacionesView, ['Cobranza']) },
        {
          path: 'cancelaciones/:idCancelacion',
          element: PathSesion(CancelacionView, ['Cobranza', 'Administrativo']),
        },
        {
          path: 'creditos/:idCredito',
          element: PathSesion(CreditoOnlyView, [
            'Supervisor',
            'Asesor',
            'Gerente de Sucursal',
            'Administrativo',
          ]),
        },
        {
          path: 'creditos/user/:idUser',
          element: PathSesion(CreditosByUserView, [
            'Supervisor',
            'Asesor',
            'Gerente de Sucursal',
            'Administrativo',
          ]),
        },
        {
          path: 'creditos/cliente/:idCliente',
          element: PathSesion(CreditoClienteOnlyView, [
            'Supervisor',
            'Asesor',
            'Gerente de Sucursal',
          ]),
        },
        { path: 'gastos', element: PathSesion(GastosView, ['Gerente de Sucursal']) },
        { path: 'pagos', element: PathSesion(PagosView, ['Administrativo']) },
        {
          path: 'pagos/credito/:idCredito',
          element: PathSesion(PagosByCreditoView, ['Administrativo']),
        },
        {
          path: 'usuarios',
          element: PathSesion(UsuariosView, ['Director', 'RRHH', 'Gerente Regional']),
        },
        { path: 'asesores', element: PathSesion(AsesoresView, ['Supervisor']) },
        { path: 'sucursales', element: PathSesion(SucursalesView, ['Administrativo']) },
        { path: 'calendario', element: PathSesion(CalendarioView, ['Administrativo']) },
        { path: 'notificaciones', element: PathSesion(NotificacionesView, AllRols) },
        { path: 'reportes-error', element: PathSesion(ErrorAppView, AllRols) },
        { path: '*', element: <Navigate to='/404' /> },
      ],
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: '/404', element: <NotFound /> },
        { path: '/login', element: NotPathSesion(Auth) },
        {
          path: '/confirmar-datos-cliente/:idTimeMessage/:idCliente',
          element: NotPathSesion(ConfirmDataClient),
        },
        { path: '/reset-password', element: NotPathSesion(ResetPassword) },
        { path: '/reset-password/:idTimeMessage', element: NotPathSesion(RestaurarCuenta) },
        { path: '/', element: NotPathSesion(Auth) },
        { path: '*', element: <Navigate to='/404' /> },
      ],
    },
  ];
};

const App = () => {
  const { token, me, setMe } = useContext(MeContext);
  const [LoandingSesion, setLoandingSesion] = useState<boolean>(false);

  const FetchMe = async () => {
    setLoandingSesion(true);

    try {
      const meResponse = await (await GetMeUser({ token })).data.me;
      setMe(meResponse);
      setLoandingSesion(false);
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
      setLoandingSesion(false);
    }
  };

  useEffect(() => {
    token && FetchMe();
  }, [token]);

  const validSesion = () => {
    if (LoandingSesion) {
      return LoandingSesion;
    }

    if (token && me.idRol) {
      return false;
    }

    if (!token && !me.idRol) {
      return false;
    }

    return true;
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer delay={5000} position='top-right' />
      <GlobalStyles />
      <Suspense fallback={<div />}>
        {useRoutes(validSesion() ? RenderPathLoanding() : RenderRouter(me.idRol))}
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
