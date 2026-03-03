import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/user.service";
import { getCurrentUser } from "./authSlice"; // Import this to refresh user data
import toast from "react-hot-toast";

const initialState = {
  profile: null,
  loans: [],
  uploadProgress: {},
  loading: false,
  error: null,
};

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, { rejectWithValue, dispatch }) => {
    try {
      const response = await userService.updateProfile(profileData);
      // Refresh user data after profile update
      await dispatch(getCurrentUser());
      toast.success("Profile updated successfully");
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  },
);

export const uploadPhoto = createAsyncThunk(
  "user/uploadPhoto",
  async ({ file, type }, { dispatch, rejectWithValue }) => {
    try {
      // Simulate progress
      const onProgress = (progress) => {
        dispatch(setUploadProgress({ type, progress }));
      };

      const response = await userService.uploadPhoto(file, type, onProgress);

      // Clear progress after completion
      setTimeout(() => {
        dispatch(clearUploadProgress(type));
      }, 1000);

      // Refresh user data to get updated photos
      await dispatch(getCurrentUser());

      toast.success(
        `${type === "profile" ? "Profile" : "ID"} photo uploaded successfully`,
      );

      return { type, photo: response.photo };
    } catch (error) {
      // Clear progress on error
      dispatch(clearUploadProgress(type));
      const message = error.response?.data?.message || "Upload failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const getUserLoans = createAsyncThunk(
  "user/getUserLoans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getUserLoans();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch loans",
      );
    }
  },
);

export const applyForLoan = createAsyncThunk(
  "user/applyForLoan",
  async (loanData, { rejectWithValue }) => {
    try {
      const response = await userService.applyForLoan(loanData);
      toast.success("Loan application submitted successfully");
      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Application failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUploadProgress: (state, action) => {
      const { type, progress } = action.payload;
      state.uploadProgress[type] = progress;
    },
    clearUploadProgress: (state, action) => {
      delete state.uploadProgress[action.payload];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.user) {
          state.profile = action.payload.user;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload Photo
      .addCase(uploadPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadPhoto.fulfilled, (state) => {
        state.loading = false;
        // Don't update local state here - let getCurrentUser handle it
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Loans
      .addCase(getUserLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.loans = action.payload.loans || [];
      })
      .addCase(getUserLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Apply for Loan
      .addCase(applyForLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForLoan.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.loan) {
          state.loans = [action.payload.loan, ...state.loans];
        }
      })
      .addCase(applyForLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUploadProgress, clearUploadProgress, clearError } =
  userSlice.actions;
export default userSlice.reducer;
