import { configureStore } from "@reduxjs/toolkit";
import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux";
import { persistStore,persistReducer } from "redux-persist";
import { rootPersistConfig,rootReducer } from "./rootreducers";

const store = configureStore({
    reducer:persistReducer(rootPersistConfig,rootReducer),
    middleware:(getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck:false,
            immutableCheck:false
        }),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = ()=> useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export {store,persistor};