import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "../../services/admin.service";
import toast from "react-hot-toast";

const initialState = {
  users: [],
  loans: [],
  selectedUser: null,
  stats: null,
  loanStats: null,
  loading: false,
  error: null,
};

// Async thunks
export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getAllUsers();
      return response.users;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users",
      );
    }
  },
);

export const getUserDetails = createAsyncThunk(
  "admin/getUserDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminService.getUserDetails(userId);
      return response.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user details",
      );
    }
  },
);

export const getAllLoans = createAsyncThunk(
  "admin/getAllLoans",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await adminService.getAllLoans(filters);
      return response.loans;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch loans",
      );
    }
  },
);

export const getLoanStats = createAsyncThunk(
  "admin/getLoanStats",
  async (year, { rejectWithValue }) => {
    try {
      const response = await adminService.getLoanStats(year);
      return response.stats;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats",
      );
    }
  },
);

export const approveLoan = createAsyncThunk(
  "admin/approveLoan",
  async ({ loanId, notes }, { rejectWithValue }) => {
    try {
      const response = await adminService.approveLoan(loanId, notes);
      toast.success("Loan approved successfully");
      return response.loan;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve loan",
      );
    }
  },
);

export const rejectLoan = createAsyncThunk(
  "admin/rejectLoan",
  async ({ loanId, reason }, { rejectWithValue }) => {
    try {
      const response = await adminService.rejectLoan(loanId, reason);
      toast.success("Loan rejected successfully");
      return response.loan;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reject loan",
      );
    }
  },
);

export const processPayment = createAsyncThunk(
  "admin/processPayment",
  async ({ loanId, amount, notes }, { rejectWithValue }) => {
    try {
      const response = await adminService.processPayment(loanId, {
        amount,
        notes,
      });
      toast.success("Payment processed successfully");
      return response.loan;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to process payment",
      );
    }
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Get User Details
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Get All Loans
      .addCase(getAllLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.loans = action.payload;
      })
      .addCase(getAllLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Loan Stats
      .addCase(getLoanStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLoanStats.fulfilled, (state, action) => {
        state.loading = false;
        state.loanStats = action.payload;
      })
      .addCase(getLoanStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Approve Loan
      .addCase(approveLoan.fulfilled, (state, action) => {
        const index = state.loans.findIndex(
          (l) => l._id === action.payload._id,
        );
        if (index !== -1) {
          state.loans[index] = action.payload;
        }
      })

      // Reject Loan
      .addCase(rejectLoan.fulfilled, (state, action) => {
        const index = state.loans.findIndex(
          (l) => l._id === action.payload._id,
        );
        if (index !== -1) {
          state.loans[index] = action.payload;
        }
      })

      // Process Payment
      .addCase(processPayment.fulfilled, (state, action) => {
        const index = state.loans.findIndex(
          (l) => l._id === action.payload._id,
        );
        if (index !== -1) {
          state.loans[index] = action.payload;
        }
      });
  },
});

export const { clearSelectedUser, clearError } = adminSlice.actions;
export default adminSlice.reducer;
