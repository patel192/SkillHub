import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import uiReducer from "./features/ui/uiSlice";
import settingsReducer from "./features/settings/settingsSlice";
import coursesReducer from "./features/courses/coursesSlice";
import usersReducer from "./features/users/usersSlice";
import communityReducer from "./features/community/communitySlice";
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
    ui:uiReducer,
    settings:settingsReducer,
    courses:coursesReducer,
    users:usersReducer,
    community:communityReducer,
  }
});

export const persistor = persistStore(store);