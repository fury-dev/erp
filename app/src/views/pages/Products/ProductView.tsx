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
import GenericChart from '../../../components/Chart';

export const ProductView = () => {
  const location = useLocation();

  const { item, updateQuery, loading } = useFind<Product>('product');
  const { updateQuery: updateChartsQuery, series } = useChart();

  const id = getIdFromUrl(location.pathname);
  useEffect(() => {
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
  }, [updateQuery, id]);

  const currency = useSelector((state: RootState) => state.customization.currency);

  const symbol = currencySymbol[currency];
  return loading ? (
    <ViewSkeleton />
  ) : (
    <Grid container>
      <Grid item xs={10}>
        {item?.image && (
          <img
            src={item?.image || ''}
            width="80%"
            height="80%"
            style={{
              objectFit: 'contain'
            }}
          />
        )}
      </Grid>
      <Grid item xs={2}>
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
        <GenericChart<'product'>
          item="product"
          filter={{
            item: 'order',
            group: 'status',
            id: [id],
            queryPath: 'productId'
          }}
          items={[
            {
              label: 'Product',
              value: 'product'
            }
          ]}
        />
      </Grid>
    </Grid>
  );
};
