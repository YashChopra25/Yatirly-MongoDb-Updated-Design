import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/slices/auth.slice";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

// Define the root state type
export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks for dispatch and selector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
