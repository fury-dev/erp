// assets
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const pages = {
  id: 'pages',
  title: 'Items',
  type: 'group',
  children: [
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
