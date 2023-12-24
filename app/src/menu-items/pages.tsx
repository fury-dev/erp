// assets
import { IconKey } from '../../node_modules/@tabler/icons-react';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Pages',
  caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Authentication',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'login3',
          title: 'Login',
          type: 'item',
          url: '/pages/login/login3',
          target: true
        },
        {
          id: 'register3',
          title: 'Register',
          type: 'item',
          url: '/pages/register/register3',
          target: true
        },
        {
          id: 'products',
          title: 'Register',
          type: 'item',
          url: '/pages/register/register3',
          target: true
        }
      ]
    },
    {
      id: 'productsView',
      title: 'Products',
      type: 'collapse',
      icon: Inventory2Icon,

      children: [
        {
          id: 'products',
          title: 'List',
          type: 'item',
          url: 'products',
          target: true
        }
      ]
    },
    {
      id: 'orderView',
      title: 'Orders',
      type: 'collapse',
      icon: ShoppingCartIcon,

      children: [
        {
          id: 'orders',
          title: 'List',
          type: 'item',
          url: 'orders',
          target: true
        }
      ]
    },
    {
      id: 'expensesView',
      title: 'Expenses',
      type: 'collapse',
      icon: ReceiptLongIcon,

      children: [
        {
          id: 'expenses',
          title: 'List',
          type: 'item',
          url: 'expenses',
          target: true
        }
      ]
    }
  ]
};

export default pages;
