import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (params) => {
    const response = await axios.post("/auth/login", params);

    return response.data;
  }
);
export const fetchRegister = createAsyncThunk(
  "auth/fetchRegister",
  async (params) => {
    const response = await axios.post("/auth/register", params);

    return response.data;
  }
);
export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
  const response = await axios.get("/auth/me");
  return response.data;
});
const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    logout: (state, action) => {
      state.data = null;
    },
  },
  extraReducers: {
    [fetchUserData.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchUserData.rejected]: (state, action) => {
      state.status = "failed";
    },
    [fetchUserData.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchAuthMe.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchAuthMe.rejected]: (state, action) => {
      state.status = "failed";
    },
    [fetchAuthMe.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchRegister.rejected]: (state, action) => {
      state.status = "failed";
    },
    [fetchRegister.pending]: (state, action) => {
      state.status = "loading";
    },
  },
});

export const selectIsAuth = (state) => Boolean(state.authReducer.data);
export const authReducer = authSlice.reducer;
export const { logout } = authSlice.actions;
