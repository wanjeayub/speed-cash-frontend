import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/user.service";
import { getCurrentUser } from "./authSlice";
import toast from "react-hot-toast";

const initialState = {
  profile: null,
  loans: [],
  currentLoan: null,
  uploadProgress: {},
  loading: false,
  error: null,
};

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, { rejectWithValue, dispatch }) => {
    try {
      const response = await userService.updateProfile(profileData);
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
      const onProgress = (progress) => {
        dispatch(setUploadProgress({ type, progress }));
      };

      const response = await userService.uploadPhoto(file, type, onProgress);

      setTimeout(() => {
        dispatch(clearUploadProgress(type));
      }, 1000);

      await dispatch(getCurrentUser());

      toast.success(
        `${type === "profile" ? "Profile" : "ID"} photo uploaded successfully`,
      );

      return { type, photo: response.photo };
    } catch (error) {
      dispatch(clearUploadProgress(type));
      const message = error.response?.data?.message || "Upload failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const deletePhoto = createAsyncThunk(
  "user/deletePhoto",
  async (type, { rejectWithValue, dispatch }) => {
    try {
      await userService.deletePhoto(type);
      await dispatch(getCurrentUser());
      toast.success("Photo deleted successfully");
      return type;
    } catch (error) {
      const message = error.response?.data?.message || "Delete failed";
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

export const getLoanById = createAsyncThunk(
  "user/getLoanById",
  async (loanId, { rejectWithValue }) => {
    try {
      const response = await userService.getLoanById(loanId);
      return response.loan;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch loan",
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

export const updateLoan = createAsyncThunk(
  "user/updateLoan",
  async ({ loanId, loanData }, { rejectWithValue }) => {
    try {
      const response = await userService.updateLoan(loanId, loanData);
      toast.success("Loan updated successfully");
      return response.loan;
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const deleteLoan = createAsyncThunk(
  "user/deleteLoan",
  async (loanId, { rejectWithValue }) => {
    try {
      await userService.deleteLoan(loanId);
      toast.success("Loan deleted successfully");
      return loanId;
    } catch (error) {
      const message = error.response?.data?.message || "Delete failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await userService.changePassword(passwordData);
      toast.success("Password changed successfully");
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to change password";
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
    clearCurrentLoan: (state) => {
      state.currentLoan = null;
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
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Photo
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePhoto.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deletePhoto.rejected, (state, action) => {
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

      // Get Loan By ID
      .addCase(getLoanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLoanById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLoan = action.payload;
      })
      .addCase(getLoanById.rejected, (state, action) => {
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
      })

      // Update Loan
      .addCase(updateLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLoan.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.loans.findIndex(
          (loan) => loan._id === action.payload._id,
        );
        if (index !== -1) {
          state.loans[index] = action.payload;
        }
        if (state.currentLoan?._id === action.payload._id) {
          state.currentLoan = action.payload;
        }
      })
      .addCase(updateLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Loan
      .addCase(deleteLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLoan.fulfilled, (state, action) => {
        state.loading = false;
        state.loans = state.loans.filter((loan) => loan._id !== action.payload);
        if (state.currentLoan?._id === action.payload) {
          state.currentLoan = null;
        }
      })
      .addCase(deleteLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setUploadProgress,
  clearUploadProgress,
  clearCurrentLoan,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
