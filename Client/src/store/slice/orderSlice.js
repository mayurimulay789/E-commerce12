import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import orderService from "../../services/orderService"

const initialState = {
  orders: [],
  order: null,
  isLoading: false,
  isError: false,
  message: "",
}

// Create Razorpay order
export const createRazorpayOrder = createAsyncThunk("orders/createRazorpayOrder", async (amount, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await orderService.createRazorpayOrder(amount, token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Verify payment
export const verifyPayment = createAsyncThunk("orders/verifyPayment", async (paymentData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await orderService.verifyPayment(paymentData, token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Get user orders
export const getUserOrders = createAsyncThunk("orders/getUserOrders", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await orderService.getUserOrders(token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Get order by ID
export const getOrderById = createAsyncThunk("orders/getById", async (orderId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await orderService.getOrderById(orderId, token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

export const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.message = ""
    },
    clearOrder: (state) => {
      state.order = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRazorpayOrder.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createRazorpayOrder.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(verifyPayment.pending, (state) => {
        state.isLoading = true
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isLoading = false
        state.order = action.payload.order
        state.message = action.payload.message
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.order = action.payload.order
      })
  },
})

export const { reset, clearOrder } = orderSlice.actions
export default orderSlice.reducer
