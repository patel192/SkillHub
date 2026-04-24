import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import { persistStore,persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key:"root",
  storage,
};

const persistedAuthReducer = persistReducer(
  persistConfig,
  authReducer
)
export const store = configureStore({
  reducer:{
    auth:persistedAuthReducer,
  }
});

export const persistor = persistStore(store);