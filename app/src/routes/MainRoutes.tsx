import { lazy } from 'react';

// project imports
import MainLayout from '../layout/MainLayout';
import Loadable from '../ui-component/Loadable';
import { ProductView } from '../views/pages/Products/ProductView';
import { ProductSchemaView } from '../views/pages/ProductSchema/ProductSchemaView';
import OrderView from '../views/pages/Orders/OrderView';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('../views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('../views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('../views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('../views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('../views/utilities/TablerIcons')));
const ProductList = Loadable(lazy(() => import('../views/pages/Products/ProductList')));
const OrderList = Loadable(lazy(() => import('../views/pages/Orders/OrderList')));
const ExpenseList = Loadable(lazy(() => import('../views/pages/Expense/ExpenseList')));
const ProductSchemaList = Loadable(lazy(() => import('../views/pages/ProductSchema/ProductSchemaList')));

// sample page routing

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/home',
  element: <MainLayout />,
  children: [
    {
      path: '/home',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'tabler-icons',
          element: <UtilsTablerIcons />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'material-icons',
          element: <UtilsMaterialIcons />
        }
      ]
    },

    {
      path: 'products',
      element: <ProductList />
    },
    {
      path: 'product/:id',
      element: <ProductView />
    },
    {
      path: 'orders',
      element: <OrderList />
    },
    {
      path: 'expenses',
      element: <ExpenseList />
    },
    {
      path: 'productSchemas',
      element: <ProductSchemaList />
    },
    {
      path: 'productSchema/:id',
      element: <ProductSchemaView />
    },
    {
      path: 'order/:id',
      element: <OrderView />
    }
  ]
};

export default MainRoutes;
