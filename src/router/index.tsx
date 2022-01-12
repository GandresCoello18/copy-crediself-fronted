/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { Navigate, useRoutes } from 'react-router-dom';
import { NotFound } from '../view/NotFound';
import { Suspense, lazy } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import MainLayout from '../layouts/MainLayout';
import Cookies from 'js-cookie';
import { ThemeProvider } from '@material-ui/styles';
import GlobalStyles from '../components/GlobalStyles';
import theme from '../theme';
import { Auth } from '../view/auth';
import { LazyExoticComponent, useContext, useEffect } from 'react';
import { GetMeUser } from '../api/users';
import { MeContext } from '../context/contextMe';
import { toast, ToastContainer } from 'react-toast';
import { ResetPassword } from '../view/reset-password';
import { RestaurarCuenta } from '../view/reset-password-idTime';
import { AxiosError } from 'axios';
import { HandleError } from '../helpers/handleError';

// import dinamic
const PermisosView = lazy(() => import('../view/permisos'));
const ComisionesView = lazy(() => import('../view/comisiones'));
const MisComisionesView = lazy(() => import('../view/mis-comision'));
const AccountView = lazy(() => import('../view/account'));
const RolesView = lazy(() => import('../view/roles'));
const UsuariosView = lazy(() => import('../view/usuarios'));
const AsesoresView = lazy(() => import('../view/asesores'));
const NotificacionesView = lazy(() => import('../view/notificacion'));
const ClientesView = lazy(() => import('../view/clientes'));
const ClienteOnlyView = lazy(() => import('../view/cliente-id'));
const ClientesAcreditacionView = lazy(() => import('../view/clientes-acreditacion'));
const CreditosView = lazy(() => import('../view/creditos'));
const CreditoOnlyView = lazy(() => import('../view/credito-id'));
const CreditoClienteOnlyView = lazy(() => import('../view/credito-cliente-id'));
const GastosView = lazy(() => import('../view/gastos'));
const PagosView = lazy(() => import('../view/pagos'));
const PagosByCreditoView = lazy(() => import('../view/pagos-credito'));
const CalendarioView = lazy(() => import('../view/calendar'));
const ErrorAppView = lazy(() => import('../view/errorApp'));
const ConfirmDataClient = lazy(() => import('../view/confirm-data-client'));

const token = Cookies.get('access-token-crediself');

const PathSesion = (Componente: LazyExoticComponent<() => JSX.Element>) => {
  return token ? <Componente /> : <Navigate to='/login' />;
};

const NotPathSesion = (Componente: any) => {
  return token ? <Navigate to='/app/dashboard' /> : <Componente />;
};

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'mis-comisiones', element: PathSesion(MisComisionesView) },
      { path: 'comisiones', element: PathSesion(ComisionesView) },
      { path: 'permisos', element: PathSesion(PermisosView) },
      { path: 'roles', element: PathSesion(RolesView) },
      { path: 'account', element: PathSesion(AccountView) },
      { path: 'clientes', element: PathSesion(ClientesView) },
      { path: 'clientes/:idCliente', element: PathSesion(ClienteOnlyView) },
      { path: 'clientes-acreditacion', element: PathSesion(ClientesAcreditacionView) },
      { path: 'creditos', element: PathSesion(CreditosView) },
      { path: 'creditos/:idCredito', element: PathSesion(CreditoOnlyView) },
      { path: 'creditos/cliente/:idCliente', element: PathSesion(CreditoClienteOnlyView) },
      { path: 'gastos', element: PathSesion(GastosView) },
      { path: 'pagos', element: PathSesion(PagosView) },
      { path: 'pagos/credito/:idCredito', element: PathSesion(PagosByCreditoView) },
      { path: 'usuarios', element: PathSesion(UsuariosView) },
      { path: 'asesores', element: PathSesion(AsesoresView) },
      { path: 'calendario', element: PathSesion(CalendarioView) },
      { path: 'notificaciones', element: PathSesion(NotificacionesView) },
      { path: 'reportes-error', element: PathSesion(ErrorAppView) },
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

const App = () => {
  const routing = useRoutes(routes);
  const { token, setMe } = useContext(MeContext);

  useEffect(() => {
    try {
      const FetchMe = async () => {
        const { me } = await (await GetMeUser({ token })).data;
        setMe(me);
      };

      token && FetchMe();
    } catch (error) {
      toast.error(HandleError(error as AxiosError));
    }
  }, [token, setMe]);

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer delay={5000} position='top-right' />
      <GlobalStyles />
      <Suspense fallback={<div />}>{routing}</Suspense>
    </ThemeProvider>
  );
};

export default App;
