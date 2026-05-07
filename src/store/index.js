import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import analyticsReducer from './analyticsSlice';
import importReducer from './importSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    analytics: analyticsReducer,
    import: importReducer,
  },
});
