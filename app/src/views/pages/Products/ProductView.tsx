import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFind } from '../../../service/controllers';
import { getIdFromUrl } from '../../utilities/Validators';
import { Box, Grid } from '@mui/material';
import { Product } from '../../../types/items/product';
import { ItemText } from '../../../ui-component/Typography/ItemText';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { convertFromINR, currencySymbol } from '../../../data/Product/currency';
import { ViewSkeleton } from '../../../ui-component/cards/Skeleton/ViewSkeleton';
import GenericChart from '../../../components/Chart';
import { IoMdImage } from 'react-icons/io';
import { ElevatedBox } from '../../../components/StyledComponents/ElevatedBox';
import { LinkText } from '../../../ui-component/Typography/LinkText';
import { useDialogContext } from '../../../context/useDialogContext';
import { CustomToolBar } from '../../../layout/Customization/CustomToolBar';
import { useProduct } from './hooks/useProduct';
import { ProductSetup } from './ProductSetup';

export const ProductView = () => {
  const location = useLocation();
  const customization = useSelector((state: RootState) => state.customization);
  const { deleteRequest } = useProduct();
  const { setComponent } = useDialogContext();
  const navigate = useNavigate();

  const { item, updateQuery, loading } = useFind<Product>('product');

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
      <CustomToolBar
        Component={
          <ProductSetup
            product={item!}
            onClose={() => {
              setComponent(false);
            }}
            open={true}
          />
        }
        deleteRequest={async () => {
          item?.id && (await deleteRequest([item?.id]));
          navigate(-1);
        }}
      />
      <Grid item xs={9}>
        <ElevatedBox
          display="flex"
          flexDirection="row"
          justifyContent="center"
          sx={{ height: '100%', alignItems: 'center', borderRadius: `${customization.borderRadius}px` }}
        >
          {item?.image ? (
            <img
              src={item.image}
              width="80%"
              height="80%"
              style={{
                objectFit: 'contain'
              }}
            />
          ) : (
            <IoMdImage />
          )}
        </ElevatedBox>
      </Grid>
      <Grid item xs={12} md={2.3}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <ItemText header="Product Name" text={item?.name} />
          <ItemText header="Size" text={item?.size} />
          <ItemText header="Distributor price" text={`${convertFromINR(item?.price.amount || 0, currency).toFixed(2)} ${symbol}`} />
          <LinkText header="ProductSchema" text={item?.productSchema?.name} itemType="productSchema" link={item?.productSchema?.id} />
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
