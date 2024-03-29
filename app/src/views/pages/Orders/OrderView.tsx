import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFind } from '../../../service/controllers';
import { getIdFromUrl } from '../../utilities/Validators';
import { Box, Grid } from '@mui/material';
import { ItemText } from '../../../ui-component/Typography/ItemText';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { convertFromINR, currencySymbol } from '../../../data/Product/currency';
import { ViewSkeleton } from '../../../ui-component/cards/Skeleton/ViewSkeleton';
import { IoMdImage } from 'react-icons/io';
import { ElevatedBox } from '../../../components/StyledComponents/ElevatedBox';
import { Order } from '../../../types/items/order';
import { LinkText } from '../../../ui-component/Typography/LinkText';
import { useTranslation } from 'react-i18next';
import { useDialogContext } from '../../../context/useDialogContext';
import { OrderSetup } from './OrderSetup';
import { useOrder } from './hooks/useOrder';
import { CustomToolBar } from '../../../layout/Customization/CustomToolBar';

const OrderView = () => {
  const location = useLocation();
  const customization = useSelector((state: RootState) => state.customization);
  const { setComponent } = useDialogContext();
  const borderRadiusPx = `${customization.borderRadius}px`;
  const { deleteRequest } = useOrder();
  const navigate = useNavigate();

  const currency = useSelector((state: RootState) => state.customization.currency);

  const symbol = currencySymbol[currency];
  const { item, updateQuery, loading } = useFind<Order>('order');
  const { t } = useTranslation();
  const id = getIdFromUrl(location.pathname);
  useEffect(() => {
    updateQuery({
      deleted: 0,
      id: [id]
    });
  }, [updateQuery, id]);

  return loading ? (
    <ViewSkeleton />
  ) : (
    <Grid container gap={1}>
      <CustomToolBar
        Component={
          <OrderSetup
            open={true}
            order={item!}
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
        <ElevatedBox sx={{ borderRadius: borderRadiusPx }}>
          {item?.product?.image ? (
            <img
              src={item?.product?.image}
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
            flexDirection: 'column',
            overflow: 'clip',
            textOverflow: 'ellipsis',
            width: '100%'
          }}
        >
          <ItemText header="Status" text={t(`order.status.${item?.status}`)} />
          <ItemText header="Price" text={`${convertFromINR(item?.amount.amount || 0, currency).toFixed(2)} ${symbol}`} />
          <ItemText header="Version" text={item?.versionId.toString()} />
          <LinkText header="Product" link={item?.product?.id} text={item?.product?.name} itemType="product" />
          <ItemText header="Order Date" text={item?.orderDate} />
          <ItemText header="Order Type" text={t(`order.type.${item?.orderType}`)} />
          <ItemText header="Paid" text={item?.paymentStatus ? t('general.yes') : t('general.no')} />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <ElevatedBox
          display="flex"
          flexDirection="column"
          header="order.detail.title"
          headerStyle={{
            textAlign: 'left',
            width: '100%'
          }}
        >
          <ItemText header="Customer Name" text={item?.customerName} />
          <ItemText header="Address" text={item?.location?.address} />
          <ItemText header="City" text={item?.location?.city} />
          <ItemText header="State" text={item?.location?.state} />

          <ItemText header="Country" text={item?.location?.country} />
          <ItemText header="Pincode" text={item?.location?.pincode} />
        </ElevatedBox>
      </Grid>
    </Grid>
  );
};
export default OrderView;
