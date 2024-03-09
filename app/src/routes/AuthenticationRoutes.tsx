import { lazy } from 'react';

// project imports
import Loadable from '../ui-component/Loadable';
import MinimalLayout from '../layout/MinimalLayout';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('../views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('../views/pages/authentication/authentication3/Register3')));
const ChangePassword = Loadable(lazy(() => import('../views/pages/authentication/auth-forms/ChangePassword')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/',
      element: <AuthLogin3 />
    },
    {
      path: '/register',
      element: <AuthRegister3 />
    },
    {
      path: '/change-password',
      element: <ChangePassword />
    }
  ]
};

export default AuthenticationRoutes;
