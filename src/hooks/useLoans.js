import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserLoans,
  applyForLoan,
  selectFilteredLoans,
  selectLoanStats,
  selectLoansByStatus,
} from "../store/slices/loanSlice";

export const useLoans = () => {
  const dispatch = useDispatch();
  const loans = useSelector(selectFilteredLoans);
  const stats = useSelector(selectLoanStats);
  const groupedLoans = useSelector(selectLoansByStatus);
  const loading = useSelector((state) => state.loans.loading);

  useEffect(() => {
    dispatch(getUserLoans());
  }, [dispatch]);

  const apply = async (loanData) => {
    return await dispatch(applyForLoan(loanData));
  };

  const getLoansByStatus = (status) => {
    return loans.filter((loan) => loan.status === status);
  };

  const getTotalBorrowed = () => {
    return loans.reduce((sum, loan) => sum + loan.amount, 0);
  };

  const getActiveLoans = () => {
    return loans.filter((loan) =>
      ["pending", "approved", "partial"].includes(loan.status),
    );
  };

  return {
    loans,
    stats,
    groupedLoans,
    loading,
    apply,
    getLoansByStatus,
    getTotalBorrowed,
    getActiveLoans,
  };
};
