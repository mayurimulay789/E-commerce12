import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from "../../services/authService"

const user = JSON.parse(localStorage.getItem("user"))
const token = localStorage.getItem("token")

const initialState = {
  user: user ? user : null,
  token: token ? token : null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
}

// Register user
export const register = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
  try {
    return await authService.register(userData)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Login user
export const login = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
  try {
    return await authService.login(userData)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Get user profile
export const getProfile = createAsyncThunk("auth/getProfile", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await authService.getProfile(token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Update profile
export const updateProfile = createAsyncThunk("auth/updateProfile", async (userData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await authService.updateProfile(userData, token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ""
    },
    logout: (state) => {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      state.user = null
      state.token = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
        state.token = null
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
        state.token = null
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload.user
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.isSuccess = true
        state.message = action.payload.message
      })
  },
})

export const { reset, logout } = authSlice.actions
export default authSlice.reducer
