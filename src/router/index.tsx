/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { Navigate, useRoutes } from 'react-router-dom';
import { NotFound } from '../view/NotFound';
import { Panel } from '../view/home';
import { Suspense, lazy } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import MainLayout from '../layouts/MainLayout';
import Cookies from 'js-cookie';
import { ThemeProvider } from '@material-ui/styles';
import GlobalStyles from '../components/GlobalStyles';
import theme from '../theme';
import { Auth } from '../view/auth';
import { useContext, useEffect } from 'react';
import { GetMeUser } from '../api/users';
import { MeContext } from '../context/contextMe';
import { toast, ToastContainer } from 'react-toast';
import { ResetPassword } from '../view/reset-password';
import { RestaurarCuenta } from '../view/reset-password-idTime';
import { AxiosError } from 'axios';
import { HandleError } from '../helpers/handleError';

// import dinamic
const PermisosView = lazy(() => import('../view/permisos'));
const AccountView = lazy(() => import('../view/account'));
const RolesView = lazy(() => import('../view/roles'));
const UsuariosView = lazy(() => import('../view/usuarios'));
const NotificacionesView = lazy(() => import('../view/notificacion'));
const ClientesView = lazy(() => import('../view/clientes'));
const ClienteOnlyView = lazy(() => import('../view/cliente-id'));
const CreditosView = lazy(() => import('../view/creditos'));
const CreditoOnlyView = lazy(() => import('../view/credito-id'));
const CreditoClienteOnlyView = lazy(() => import('../view/credito-cliente-id'));
const GastosView = lazy(() => import('../view/gastos'));
const PagosView = lazy(() => import('../view/pagos'));
const PagosByCreditoView = lazy(() => import('../view/pagos-credito'));
const CalendarioView = lazy(() => import('../view/calendar'));

const token = Cookies.get('access-token-crediself');

const PathSesion = (Componente: any) => {
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
      { path: 'dashboard', element: PathSesion(Panel) },
      { path: 'permisos', element: PathSesion(PermisosView) },
      { path: 'roles', element: PathSesion(RolesView) },
      { path: 'account', element: PathSesion(AccountView) },
      { path: 'clientes', element: PathSesion(ClientesView) },
      { path: 'clientes/:idCliente', element: PathSesion(ClienteOnlyView) },
      { path: 'creditos', element: PathSesion(CreditosView) },
      { path: 'creditos/:idCredito', element: PathSesion(CreditoOnlyView) },
      { path: 'creditos/cliente/:idCliente', element: PathSesion(CreditoClienteOnlyView) },
      { path: 'gastos', element: PathSesion(GastosView) },
      { path: 'pagos', element: PathSesion(PagosView) },
      { path: 'pagos/credito/:idCredito', element: PathSesion(PagosByCreditoView) },
      { path: 'usuarios', element: PathSesion(UsuariosView) },
      { path: 'calendario', element: PathSesion(CalendarioView) },
      { path: 'notificaciones', element: PathSesion(NotificacionesView) },
      { path: '*', element: <Navigate to='/404' /> },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/404', element: <NotFound /> },
      { path: '/login', element: NotPathSesion(Auth) },
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
      <ToastContainer delay={3000} position='top-right' />
      <GlobalStyles />
      <Suspense fallback={<div />}>{routing}</Suspense>
    </ThemeProvider>
  );
};

export default App;
