import { configureStore } from '@reduxjs/toolkit';
import rulesReducer from './rulesSlice';
import { RootState } from '../types/rules';

export const store = configureStore({
  reducer: {
    rules: rulesReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>; 