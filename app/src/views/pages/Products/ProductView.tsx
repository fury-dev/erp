import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useChart, useFind } from '../../../service/controllers';
import { getIdFromUrl } from '../../utilities/Validators';
import { Box, Grid } from '@mui/material';
import { Product } from '../../../types/items/product';
import { ItemText } from '../../../ui-component/Typography/ItemText';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { convertFromINR, currencySymbol } from '../../../data/Product/currency';
import { ViewSkeleton } from '../../../ui-component/cards/Skeleton/ViewSkeleton';

export const ProductView = () => {
  const location = useLocation();

  const { item, updateQuery, loading } = useFind<Product>('product');
  const { updateQuery: updateChartsQuery, series } = useChart();

  useEffect(() => {
    const id = getIdFromUrl(location.pathname);
    updateQuery({
      deleted: 0,
      id: [id]
    });
    updateChartsQuery({
      item: 'order',
      group: 'status',
      dateBy: 'ALL_TIME',
      id: [id],
      queryPath: 'productId'
    });
  }, [updateQuery]);

  const currency = useSelector((state: RootState) => state.customization.currency);

  const symbol = currencySymbol[currency];
  console.log(series);
  return loading ? (
    <ViewSkeleton />
  ) : (
    <Grid container>
      <Grid item xs={8}>
        {item?.image && <img src={`data:image/png;base64,${item?.image}`} />}
      </Grid>
      <Grid item xs={4}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <ItemText header="Product Name" text={item?.name} />
          <ItemText header="Size" text={(item?.size || []).join(',')} />
          <ItemText
            header="Distributor price"
            text={`${convertFromINR(item?.distributorPrice.amount || 0, currency).toFixed(2)} ${symbol}`}
          />
          <ItemText header="Seller price" text={`${convertFromINR(item?.sellerPrice.amount || 0, currency).toFixed(2)} ${symbol}`} />
          <ItemText header="Version" text={item?.versionId.toString()} />
        </Box>
      </Grid>
      <Grid item xs={12}>
        {/* charts */}
      </Grid>
    </Grid>
  );
};
