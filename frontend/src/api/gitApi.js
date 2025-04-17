import axios from "axios";

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Attach Firebase Auth token dynamically if needed
axiosInstance.interceptors.request.use(
  async (config) => {
    const user = JSON.parse(localStorage.getItem("firebaseUser")); // Adjust based on your auth flow
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========== GIT ACTIONS ==========

export const cloneRepository = async (repoUrl) => {
  try {
    const response = await axiosInstance.post("/repos/clone", { repoUrl });
    return response.data;
  } catch (error) {
    console.error("Clone error:", error);
    throw error.response?.data || { error: "Clone failed" };
  }
};

export const initRepository = async () => {
  try {
    const response = await axiosInstance.post("/repos/init");
    return response.data;
  } catch (error) {
    console.error("Init error:", error);
    throw error.response?.data || { error: "Init failed" };
  }
};

export const commitChanges = async (commitMessage) => {
  try {
    const response = await axiosInstance.post("/repos/commit", {
      commitMessage,
    });
    return response.data;
  } catch (error) {
    console.error("Commit error:", error);
    throw error.response?.data || { error: "Commit failed" };
  }
};

export const pushRepository = async () => {
  try {
    const response = await axiosInstance.post("/repos/push");
    return response.data;
  } catch (error) {
    console.error("Push error:", error);
    throw error.response?.data || { error: "Push failed" };
  }
};

// ========== GIT ACCOUNT LINKS ==========

export const getLinkedGitAccounts = async () => {
  try {
    const response = await axiosInstance.get("/auth/git-accounts");
    return response.data;
  } catch (error) {
    console.error("Fetch linked accounts error:", error);
    throw error.response?.data || { error: "Failed to fetch linked accounts" };
  }
};

export const unlinkGitAccount = async (provider) => {
  try {
    const response = await axiosInstance.delete(
      `/auth/git-accounts/${provider}`
    );
    return response.data;
  } catch (error) {
    console.error("Unlink error:", error);
    throw error.response?.data || { error: "Failed to unlink account" };
  }
};
