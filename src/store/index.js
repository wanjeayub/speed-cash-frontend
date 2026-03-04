import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import loanReducer from "./slices/loanSlice";
import adminReducer from "./slices/adminSlice";
import adminSettingsReducer from "./slices/adminSettingSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    loans: loanReducer,
    admin: adminReducer,
    adminSettings: adminSettingsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["loans/downloadStatement/fulfilled"],
        ignoredPaths: ["loans.repaymentSchedule"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});
