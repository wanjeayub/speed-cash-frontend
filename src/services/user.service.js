import api from "./api";

class UserService {
  // Profile methods
  async updateProfile(profileData) {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  }

  async changePassword(passwordData) {
    console.log("Changing password...");
    const response = await api.put("/users/change-password", passwordData);
    console.log("Password change response:", response.data);
    return response.data;
  }

  async uploadPhoto(file, type, onProgress) {
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("type", type);

    console.log("Uploading photo:", {
      type,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    const response = await api.post("/users/upload-photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        onProgress(percentCompleted);
      },
    });

    console.log("Upload response:", response.data);
    return response.data;
  }

  async deletePhoto(type) {
    const response = await api.delete(`/users/photo/${type}`);
    return response.data;
  }

  // Loan methods
  async getUserLoans() {
    console.log("Fetching user loans...");
    const response = await api.get("/users/loans");
    return response.data;
  }

  async getLoanById(loanId) {
    const response = await api.get(`/users/loans/${loanId}`);
    return response.data;
  }

  async applyForLoan(loanData) {
    const response = await api.post("/users/loans/apply", loanData);
    return response.data;
  }

  async updateLoan(loanId, loanData) {
    const response = await api.put(`/users/loans/${loanId}`, loanData);
    return response.data;
  }

  async deleteLoan(loanId) {
    const response = await api.delete(`/users/loans/${loanId}`);
    return response.data;
  }
}

export default new UserService();
