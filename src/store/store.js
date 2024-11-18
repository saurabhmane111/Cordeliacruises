import { configureStore } from '@reduxjs/toolkit';
import cruiseReducer from './cruiseSlice';

export const store = configureStore({
    reducer: {
        cruise: cruiseReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({

        }),
});