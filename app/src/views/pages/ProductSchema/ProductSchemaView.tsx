import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFind } from '../../../service/controllers';
import { getIdFromUrl } from '../../utilities/Validators';
import { Box, Grid } from '@mui/material';
import { Product, ProductSchema } from '../../../types/items/product';
import { ItemText } from '../../../ui-component/Typography/ItemText';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { convertFromINR, currencySymbol } from '../../../data/Product/currency';
import { ViewSkeleton } from '../../../ui-component/cards/Skeleton/ViewSkeleton';
import { IoMdImage } from 'react-icons/io';
import { ElevatedBox } from '../../../components/StyledComponents/ElevatedBox';
import { ListView } from '../../../components/List/ListView';
import { compact } from 'lodash';
import moment from 'moment';
import { useProduct } from '../Products/hooks/useProduct';

export const ProductSchemaView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const customization = useSelector((state: RootState) => state.customization);

  const { item, updateQuery, loading } = useFind<ProductSchema>('productSchema');
  const {
    products,
    list: { apiAction, stopPolling, updateQuery: updateListQuery }
  } = useProduct();
  const id = getIdFromUrl(location.pathname);
  useEffect(() => {
    updateQuery({
      deleted: 0,
      id: [id]
    });
    updateListQuery({
      deleted: 0,
      dynamicQuery: {
        productSchemaId: id
      }
    });
    return () => stopPolling();
  }, [updateQuery, id, updateListQuery, stopPolling]);

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
          <ItemText header="Product Schema Name" text={item?.name} />
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
        {/* List of all products created using schema */}
        <ListView<Product>
          columns={compact([
            {
              field: 'productId',
              headerName: 'Product ID',
              width: 100
            },
            {
              field: 'name',
              headerName: 'Name',
              width: 100
            },
            {
              field: 'price',
              headerName: 'Price',
              width: 100,
              getValue: (item: any) => `
              ${item.price.currency !== currency ? convertFromINR(item.price.amount, currency).toFixed(2) : item.price.amount} ${symbol}`
            },

            {
              field: 'createdAt',
              headerName: 'Created',
              width: 150,
              getValue: (item) => moment(parseInt(item?.createdAt || '0')).format('DD-MM-YYYY:HH:MM')
            },
            {
              field: 'updatedAt',
              headerName: 'Modified',
              width: 150,
              getValue: (item) => moment(parseInt(item?.updatedAt || '0')).format('DD-MM-YYYY:HH:MM')
            }
          ])}
          startPolling={apiAction}
          rows={products}
          stopPolling={stopPolling}
          title={'Products'}
          updateApiFilter={updateListQuery}
          rowOnClick={(item) => navigate('/home/product/' + item.id)}
        />
      </Grid>
    </Grid>
  );
};
