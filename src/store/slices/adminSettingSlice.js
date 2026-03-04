import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminSettingsService from "../../services/adminSettings.service";
import toast from "react-hot-toast";

const initialState = {
  settings: null,
  loading: false,
  error: null,
  saving: false,
};

// Get settings
export const getSettings = createAsyncThunk(
  "adminSettings/getSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminSettingsService.getSettings();
      return response.settings;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch settings",
      );
    }
  },
);

// Update notification settings
export const updateNotificationSettings = createAsyncThunk(
  "adminSettings/updateNotificationSettings",
  async (settings, { rejectWithValue }) => {
    try {
      const response =
        await adminSettingsService.updateNotificationSettings(settings);
      toast.success("Notification settings updated");
      return response.settings;
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

// Update loan settings
export const updateLoanSettings = createAsyncThunk(
  "adminSettings/updateLoanSettings",
  async (settings, { rejectWithValue }) => {
    try {
      const response = await adminSettingsService.updateLoanSettings(settings);
      toast.success("Loan settings updated");
      return response.settings;
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

// Update credit thresholds
export const updateCreditThresholds = createAsyncThunk(
  "adminSettings/updateCreditThresholds",
  async (thresholds, { rejectWithValue }) => {
    try {
      const response =
        await adminSettingsService.updateCreditThresholds(thresholds);
      toast.success("Credit thresholds updated");
      return response.settings;
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

const adminSettingsSlice = createSlice({
  name: "adminSettings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Settings
      .addCase(getSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Notification Settings
      .addCase(updateNotificationSettings.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = action.payload;
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      // Update Loan Settings
      .addCase(updateLoanSettings.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateLoanSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = action.payload;
      })
      .addCase(updateLoanSettings.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      // Update Credit Thresholds
      .addCase(updateCreditThresholds.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateCreditThresholds.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = action.payload;
      })
      .addCase(updateCreditThresholds.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminSettingsSlice.actions;
export default adminSettingsSlice.reducer;
