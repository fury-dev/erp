import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFind } from '../../../service/controllers';
import { getIdFromUrl } from '../../utilities/Validators';
import { Box, Grid } from '@mui/material';
import { ProductSchema } from '../../../types/items/product';
import { ItemText } from '../../../ui-component/Typography/ItemText';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { convertFromINR, currencySymbol } from '../../../data/Product/currency';
import { ViewSkeleton } from '../../../ui-component/cards/Skeleton/ViewSkeleton';
import { IoMdImage } from 'react-icons/io';
import { ElevatedBox } from '../../../components/StyledComponents/ElevatedBox';
import { useProduct } from '../Products/hooks/useProduct';
import { CustomToolBar } from '../../../layout/Customization/CustomToolBar';
import { useDialogContext } from '../../../context/useDialogContext';
import { ProductSchemaSetup } from './ProductSchemaSetup';
import { useProductSchema } from './hooks/useProductSchema';
import { ProductTable } from '../Products/components/ProductTable';

export const ProductSchemaView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const customization = useSelector((state: RootState) => state.customization);
  const { setComponent } = useDialogContext();

  const { item, updateQuery, loading } = useFind<ProductSchema>('productSchema');
  const {
    products,
    list: { apiAction, stopPolling, updateQuery: updateListQuery }
  } = useProduct();
  const { deleteRequest } = useProductSchema();
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
      <CustomToolBar
        Component={
          <ProductSchemaSetup
            productSchema={item!}
            onClose={() => {
              setComponent(false);
            }}
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
          <IoMdImage />
        </ElevatedBox>
      </Grid>
      <Grid item xs={12} md={2.3}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <ItemText header="Product Schema" text={item?.name} />
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
        <ProductTable view={true} products={products} apiAction={apiAction} loading={loading} stopPolling={stopPolling} />
      </Grid>
    </Grid>
  );
};
