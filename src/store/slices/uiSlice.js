import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: true,
  theme: "light",
  notifications: [],
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
  loading: {
    global: false,
    requests: {},
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload,
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        ...action.payload,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      };
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    setRequestLoading: (state, action) => {
      const { requestId, isLoading } = action.payload;
      state.loading.requests[requestId] = isLoading;
    },
    clearRequestLoading: (state, action) => {
      delete state.loading.requests[action.payload];
    },
    clearAllLoading: (state) => {
      state.loading = initialState.loading;
    },
  },
});

// Selectors
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectTheme = (state) => state.ui.theme;
export const selectNotifications = (state) => state.ui.notifications;
export const selectModal = (state) => state.ui.modal;
export const selectGlobalLoading = (state) => state.ui.loading.global;
export const selectRequestLoading = (state, requestId) =>
  state.ui.loading.requests[requestId] || false;

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  setGlobalLoading,
  setRequestLoading,
  clearRequestLoading,
  clearAllLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
