import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import loanReducer from "./slices/loanSlice";
import adminReducer from "./slices/adminSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    loans: loanReducer,
    admin: adminReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state
        ignoredActions: ["loans/downloadStatement/fulfilled"],
        ignoredPaths: ["loans.repaymentSchedule"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// RootState type for TypeScript (if using TypeScript)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
