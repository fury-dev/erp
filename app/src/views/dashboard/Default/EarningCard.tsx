import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import SkeletonEarningCard from '../../../ui-component/cards/Skeleton/EarningCard';

// assets
//@ts-ignore
import EarningIcon from '../../../assets/images/icons/earning.svg';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useApiService } from '../../../service';
import { Order } from '../../../types/items/order';
import { sum } from 'lodash';
import { convertFromINR, convertToINR, currencySymbol } from '../../../data/Product/currency';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    //@ts-ignore
    backgroundColor: theme.palette.secondary[200],
    borderRadius: '50%',
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    //@ts-ignore
    backgroundColor: theme.palette.secondary[800],
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));

const EarningCard = ({ isLoading }: { isLoading: boolean }) => {
  const theme = useTheme();

  const currency = useSelector((state: RootState) => state.customization.currency);

  const {
    list: { data, updateQuery }
  } = useApiService('order');

  useEffect(() => {
    updateQuery({
      dateBy: 'YEAR'
    });
  }, []);
  const earnings = useMemo(
    () =>
      sum(
        (data?.orders || []).map((value: Order) =>
          convertFromINR(
            convertToINR(value.amount.amount, value.amount.currency) -
              convertToINR(value.product?.distributorPrice.amount || 0, value.product?.distributorPrice.currency || 'INR') -
              convertToINR(value.product?.sellerPrice.amount || 0, value.product?.sellerPrice.currency || 'INR'),
            currency
          )
        )
      ),
    [currency]
  );
  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        //@ts-ignore
                        ...theme.typography.commonAvatar,
                        //@ts-ignore
                        ...theme.typography.largeAvatar,
                        //@ts-ignore
                        backgroundColor: theme.palette.secondary[800],
                        mt: 1
                      }}
                    >
                      <img src={EarningIcon} alt="Notification" />
                    </Avatar>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                      {currencySymbol[currency]}
                      {earnings.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Avatar
                      sx={{
                        cursor: 'pointer',
                        //@ts-ignore
                        ...theme.typography.smallAvatar,
                        //@ts-ignore
                        backgroundColor: theme.palette.secondary[200],
                        color: theme.palette.secondary.dark
                      }}
                    >
                      <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                    </Avatar>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 1.25 }}>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    //@ts-ignore

                    color: theme.palette.secondary[200]
                  }}
                >
                  Total Earnings this month
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

EarningCard.propTypes = {
  isLoading: PropTypes.bool
};

export default EarningCard;
