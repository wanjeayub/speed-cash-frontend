import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/user.service";
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
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile(profileData);
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
      toast.success(`${type} photo uploaded successfully`);

      // Clear progress after completion
      setTimeout(() => {
        dispatch(clearUploadProgress(type));
      }, 1000);

      return { type, photo: response.photo };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Upload failed");
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
      return rejectWithValue(
        error.response?.data?.message || "Application failed",
      );
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
        state.profile = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Upload Photo
      .addCase(uploadPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.loading = false;
        if (state.profile) {
          state.profile[action.payload.type] = action.payload.photo;
        }
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Get User Loans
      .addCase(getUserLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.loans = action.payload.loans;
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
        state.loans = [action.payload.loan, ...state.loans];
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
