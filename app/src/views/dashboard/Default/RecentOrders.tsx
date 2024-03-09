import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, CardActions, CardContent, Container, Divider, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import SkeletonPopularCard from '../../../ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from '../../../store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { useApiService } from '../../../service';
import { Order } from '../../../types/items/order';
import { TQueryParams } from '../../../service/controllers';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { convertFromINR, currencySymbol as _currencySymbol } from '../../../data/Product/currency';
import { useNavigate } from 'react-router-dom';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
const RecentOrders = ({ isLoading }: { isLoading: boolean }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [time, setTime] = useState<TQueryParams['dateBy']>('ALL_TIME');

  const [anchorEl, setAnchorEl] = useState(null);
  const {
    list: { data, updateMask, updateQuery }
  } = useApiService<Order>('order');
  const orders: Order[] = data?.orders || [];
  const currency = useSelector((state: RootState) => state.customization.currency);
  const currencySymbol = _currencySymbol[currency];
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChange = (value: TQueryParams['dateBy']) => {
    setTime(value);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    updateQuery(
      {
        dateBy: time,
        deleted: 1,
        limit: 5
      },
      false
    );

    updateMask(`amount{
      currency
      amount
    }
    product{
      name
    }
    status`);
  }, [time, updateMask, updateQuery]);

  const statusColor: Record<Order['status'], string> = {
    DELIVERED: theme.palette.success.light,
    OUT_FOR_DELIVERY: theme.palette.success.dark,
    PENDING: theme.palette.warning.dark,
    SHIPPED: theme.palette.info.dark
  };
  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Grid container alignContent="center" justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h4">Recent Orders</Typography>
                  </Grid>
                  <Grid item>
                    <MoreHorizOutlinedIcon
                      fontSize="small"
                      sx={{
                        color: theme.palette.primary.dark,
                        cursor: 'pointer'
                      }}
                      aria-controls="menu-popular-card"
                      aria-haspopup="true"
                      onClick={handleClick}
                    />
                    <Menu
                      id="menu-popular-card"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      variant="selectedMenu"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                    >
                      <MenuItem onClick={() => handleChange('ALL_TIME')}> All Time </MenuItem>
                      <MenuItem onClick={() => handleChange('DAY')}> Today</MenuItem>
                      <MenuItem onClick={() => handleChange('MONTH')}> This Month</MenuItem>
                      <MenuItem onClick={() => setTime('YEAR')}> This Year </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                {orders.map((order, key) => (
                  <Container key={key.toString()} onClick={() => navigate('/home/order/' + order.id)}>
                    <Grid container direction="column">
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              {order.product?.name}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              {convertFromINR(order.amount.amount, currency).toFixed(2)} {currencySymbol}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle2" sx={{ color: statusColor[order.status] }}>
                          {order.status}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 1.5 }} />
                  </Container>
                ))}
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation onClick={() => navigate('/home/orders')}>
              View All
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
};

export default RecentOrders;
