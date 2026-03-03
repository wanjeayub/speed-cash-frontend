import api from "./api";

class UserService {
  async updateProfile(profileData) {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  }

  async uploadPhoto(file, type, onProgress) {
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("type", type);

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
    return response.data;
  }

  async getUserLoans() {
    const response = await api.get("/users/loans");
    return response.data;
  }

  async applyForLoan(loanData) {
    const response = await api.post("/users/loans/apply", loanData);
    return response.data;
  }
}

export default new UserService();
