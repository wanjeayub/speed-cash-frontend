import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import loanService from "../../services/loan.service";
import toast from "react-hot-toast";

const initialState = {
  loans: [],
  currentLoan: null,
  loading: false,
  error: null,
  filters: {
    status: "",
    dateRange: {
      start: null,
      end: null,
    },
    search: "",
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

// Async thunks
export const getUserLoans = createAsyncThunk(
  "loans/getUserLoans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await loanService.getUserLoans();
      return response.loans;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch loans",
      );
    }
  },
);

export const getLoanById = createAsyncThunk(
  "loans/getLoanById",
  async (loanId, { rejectWithValue }) => {
    try {
      const response = await loanService.getLoanById(loanId);
      return response.loan;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch loan details",
      );
    }
  },
);

export const applyForLoan = createAsyncThunk(
  "loans/applyForLoan",
  async (loanData, { rejectWithValue }) => {
    try {
      const response = await loanService.applyForLoan(loanData);
      toast.success("Loan application submitted successfully!");
      return response.loan;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to apply for loan";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const calculateLoanEligibility = createAsyncThunk(
  "loans/calculateEligibility",
  async (amount, { rejectWithValue }) => {
    try {
      const response = await loanService.calculateEligibility(amount);
      return response.eligibility;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to calculate eligibility",
      );
    }
  },
);

export const getLoanRepaymentSchedule = createAsyncThunk(
  "loans/getRepaymentSchedule",
  async (loanId, { rejectWithValue }) => {
    try {
      const response = await loanService.getRepaymentSchedule(loanId);
      return response.schedule;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch repayment schedule",
      );
    }
  },
);

export const makeRepayment = createAsyncThunk(
  "loans/makeRepayment",
  async ({ loanId, amount, paymentMethod }, { rejectWithValue }) => {
    try {
      const response = await loanService.makeRepayment(loanId, {
        amount,
        paymentMethod,
      });
      toast.success("Payment processed successfully!");
      return response.loan;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to process payment";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const downloadLoanStatement = createAsyncThunk(
  "loans/downloadStatement",
  async (loanId, { rejectWithValue }) => {
    try {
      const response = await loanService.downloadLoanStatement(loanId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to download statement",
      );
    }
  },
);

const loanSlice = createSlice({
  name: "loans",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearCurrentLoan: (state) => {
      state.currentLoan = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateLoanLocally: (state, action) => {
      const index = state.loans.findIndex(
        (loan) => loan._id === action.payload._id,
      );
      if (index !== -1) {
        state.loans[index] = { ...state.loans[index], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User Loans
      .addCase(getUserLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.loans = action.payload;
        state.pagination.total = action.payload.length;
        state.pagination.pages = Math.ceil(
          action.payload.length / state.pagination.limit,
        );
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

      // Apply For Loan
      .addCase(applyForLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForLoan.fulfilled, (state, action) => {
        state.loading = false;
        state.loans = [action.payload, ...state.loans];
      })
      .addCase(applyForLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Calculate Loan Eligibility
      .addCase(calculateLoanEligibility.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateLoanEligibility.fulfilled, (state, action) => {
        state.loading = false;
        state.eligibility = action.payload;
      })
      .addCase(calculateLoanEligibility.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Repayment Schedule
      .addCase(getLoanRepaymentSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLoanRepaymentSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.repaymentSchedule = action.payload;
      })
      .addCase(getLoanRepaymentSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Make Repayment
      .addCase(makeRepayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makeRepayment.fulfilled, (state, action) => {
        state.loading = false;
        // Update the loan in the loans array
        const index = state.loans.findIndex(
          (loan) => loan._id === action.payload._id,
        );
        if (index !== -1) {
          state.loans[index] = action.payload;
        }
        // Update current loan if it's the same
        if (state.currentLoan?._id === action.payload._id) {
          state.currentLoan = action.payload;
        }
      })
      .addCase(makeRepayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectAllLoans = (state) => state.loans.loans;
export const selectCurrentLoan = (state) => state.loans.currentLoan;
export const selectLoansLoading = (state) => state.loans.loading;
export const selectLoansError = (state) => state.loans.error;
export const selectLoanFilters = (state) => state.loans.filters;

// Filtered loans selector
export const selectFilteredLoans = (state) => {
  const { loans, filters } = state.loans;
  const { status, dateRange, search } = filters;

  return loans.filter((loan) => {
    // Filter by status
    if (status && loan.status !== status) return false;

    // Filter by date range
    if (
      dateRange.start &&
      new Date(loan.applicationDate) < new Date(dateRange.start)
    )
      return false;
    if (
      dateRange.end &&
      new Date(loan.applicationDate) > new Date(dateRange.end)
    )
      return false;

    // Filter by search (loan number or purpose)
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        loan.loanNumber?.toLowerCase().includes(searchLower) ||
        loan.purpose?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });
};

// Paginated loans selector
export const selectPaginatedLoans = (state) => {
  const filteredLoans = selectFilteredLoans(state);
  const { page, limit } = state.loans.pagination;
  const start = (page - 1) * limit;
  const end = start + limit;

  return filteredLoans.slice(start, end);
};

// Loan statistics selectors
export const selectLoanStats = (state) => {
  const loans = state.loans.loans;

  return {
    totalLoans: loans.length,
    totalAmount: loans.reduce((sum, loan) => sum + loan.amount, 0),
    totalInterest: loans.reduce((sum, loan) => sum + (loan.interest || 0), 0),
    totalPaid: loans.reduce((sum, loan) => sum + (loan.amountPaid || 0), 0),
    pendingLoans: loans.filter((loan) => loan.status === "pending").length,
    approvedLoans: loans.filter((loan) => loan.status === "approved").length,
    partialLoans: loans.filter((loan) => loan.status === "partial").length,
    paidLoans: loans.filter((loan) => loan.status === "paid").length,
    defaultedLoans: loans.filter((loan) => loan.status === "defaulted").length,
  };
};

// Group loans by status
export const selectLoansByStatus = (state) => {
  const loans = state.loans.loans;

  return {
    pending: loans.filter((loan) => loan.status === "pending"),
    approved: loans.filter((loan) => loan.status === "approved"),
    partial: loans.filter((loan) => loan.status === "partial"),
    paid: loans.filter((loan) => loan.status === "paid"),
    defaulted: loans.filter((loan) => loan.status === "defaulted"),
    rejected: loans.filter((loan) => loan.status === "rejected"),
  };
};

// Group loans by month
export const selectLoansByMonth = (state) => {
  const loans = state.loans.loans;
  const grouped = {};

  loans.forEach((loan) => {
    const date = new Date(loan.applicationDate);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!grouped[monthYear]) {
      grouped[monthYear] = {
        month: date.toLocaleString("default", { month: "long" }),
        year: date.getFullYear(),
        loans: [],
        totalAmount: 0,
        count: 0,
      };
    }

    grouped[monthYear].loans.push(loan);
    grouped[monthYear].totalAmount += loan.amount;
    grouped[monthYear].count += 1;
  });

  return Object.values(grouped).sort(
    (a, b) =>
      new Date(`${a.year}-${a.month}`) - new Date(`${b.year}-${b.month}`),
  );
};

// Active loans (pending, approved, partial)
export const selectActiveLoans = (state) => {
  return state.loans.loans.filter((loan) =>
    ["pending", "approved", "partial"].includes(loan.status),
  );
};

// Overdue loans
export const selectOverdueLoans = (state) => {
  const today = new Date();
  return state.loans.loans.filter(
    (loan) =>
      ["approved", "partial"].includes(loan.status) &&
      loan.dueDate &&
      new Date(loan.dueDate) < today,
  );
};

export const {
  setFilters,
  clearFilters,
  setPagination,
  clearCurrentLoan,
  clearError,
  updateLoanLocally,
} = loanSlice.actions;

export default loanSlice.reducer;
