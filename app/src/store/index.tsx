import { configureStore } from '@reduxjs/toolkit';
import { productReducer, userReducer, orderReducer, expenseReducer, productSchemaReducer } from './reducers';
import { customizationReducer } from './reducers/customizationReducer';

// export type ItemState={
//   setup:
//   items:
// }

export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    order: orderReducer,
    expense: expenseReducer,
    customization: customizationReducer,
    productSchema: productSchemaReducer
  }
});
export const persister = 'Free';

export type RootState = ReturnType<typeof store.getState>;
