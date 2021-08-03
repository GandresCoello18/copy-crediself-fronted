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

// import dinamic
const PermisosView = lazy(() => import('../view/permisos'));
const AccountView = lazy(() => import('../view/account'));
const RolesView = lazy(() => import('../view/roles'));

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
      { path: '*', element: <Navigate to='/404' /> },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/404', element: <NotFound /> },
      { path: '/login', element: NotPathSesion(Auth) },
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
      if (error.request.response) {
        toast.error(JSON.parse(error.request.response).status);
      } else {
        toast.error(error.message);
      }
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
