import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useFind } from '../../../service/controllers';
import { getIdFromUrl } from '../../utilities/Validators';
import { Box, Grid } from '@mui/material';
import { ProductSchema } from '../../../types/items/product';
import { ItemText } from '../../../ui-component/Typography/ItemText';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { convertFromINR, currencySymbol } from '../../../data/Product/currency';
import { ViewSkeleton } from '../../../ui-component/cards/Skeleton/ViewSkeleton';
import GenericChart from '../../../components/Chart';
import { IoMdImage } from 'react-icons/io';
import { ElevatedBox } from '../../../components/StyledComponents/ElevatedBox';

export const ProductSchemaView = () => {
  const location = useLocation();
  const customization = useSelector((state: RootState) => state.customization);

  const { item, updateQuery, loading } = useFind<ProductSchema>('productSchema');

  const id = getIdFromUrl(location.pathname);
  useEffect(() => {
    updateQuery({
      deleted: 0,
      id: [id]
    });
  }, [updateQuery, id]);

  const currency = useSelector((state: RootState) => state.customization.currency);

  const symbol = currencySymbol[currency];
  return loading ? (
    <ViewSkeleton />
  ) : (
    <Grid container gap={1}>
      <Grid item xs={10}>
        <ElevatedBox
          display="flex"
          flexDirection="row"
          justifyContent="center"
          sx={{ height: '100%', alignItems: 'center', borderRadius: `${customization.borderRadius}px` }}
        >
          <IoMdImage />
        </ElevatedBox>
      </Grid>
      <Grid item xs={1}>
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
