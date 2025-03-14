import axiosInstance from "@/api/axiosInstance";
import { GetToken } from "@/utils/GetToken";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types
export interface User {
  id: string;
  name: string;
  email: string;
  // Add other user fields if necessary
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

// Async thunk for verifying user
export const verifyUser = createAsyncThunk<User>(
  "auth/verifyUser",
  async () => {
    const response = await axiosInstance.get("/api/v1/auth/user/verify");
    return response.data.data;
  }
);

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ data: User }>) => {
      state.user = action.payload.data;
    },
    logoutFn: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.token = GetToken() || "";
        state.isLoading = false;
      })
      .addCase(verifyUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { login, logoutFn } = authSlice.actions;
export default authSlice.reducer;
