import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "../../services/admin.service";
import toast from "react-hot-toast";
import api from "../../services/api";

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
  async ({ loanId, ...paymentData }, { rejectWithValue }) => {
    try {
      console.log("processPayment - loanId:", loanId);
      console.log("processPayment - paymentData:", paymentData);

      const response = await api.post(
        `/admin/loans/${loanId}/pay`,
        paymentData,
      );
      return response.data;
    } catch (error) {
      console.error("processPayment error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const markDefaultedAsPaid = createAsyncThunk(
  "admin/markDefaultedAsPaid",
  async ({ loanId, notes }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/loans/${loanId}/mark-paid`, {
        notes: notes || "Marked as paid from defaulted status",
      });
      toast.success("Loan marked as paid successfully");
      return response.data.loan || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark loan as paid",
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
      // Mark Defaulted as Paid
      .addCase(markDefaultedAsPaid.fulfilled, (state, action) => {
        const index = state.loans.findIndex(
          (l) => l._id === action.payload._id,
        );
        if (index !== -1) {
          state.loans[index] = action.payload;
        }
      })
      .addCase(markDefaultedAsPaid.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
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
