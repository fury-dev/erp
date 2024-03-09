import { ProductTable } from './components/ProductTable';
import { useProduct } from './hooks/useProduct';

const ProductList = () => {
  const {
    list: { apiAction, loading, updateQuery, stopPolling },
    products,
    selected,
    deleteRequest
  } = useProduct();

  return (
    <ProductTable
      selected={selected}
      apiAction={apiAction}
      loading={loading}
      updateApiFilter={updateQuery}
      stopPolling={stopPolling}
      products={products}
      deleteRequest={deleteRequest}
    />
  );
};
export default ProductList;
