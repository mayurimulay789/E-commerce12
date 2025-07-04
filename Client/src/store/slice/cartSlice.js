import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import cartService from "../../services/cartService"

const initialState = {
  cart: { items: [], totalAmount: 0 },
  isLoading: false,
  isError: false,
  message: "",
}

// Get cart
export const getCart = createAsyncThunk("cart/get", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await cartService.getCart(token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Add to cart
export const addToCart = createAsyncThunk("cart/add", async (itemData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await cartService.addToCart(itemData, token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Update cart item
export const updateCartItem = createAsyncThunk("cart/update", async (updateData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await cartService.updateCartItem(updateData, token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Remove from cart
export const removeFromCart = createAsyncThunk("cart/remove", async (itemId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await cartService.removeFromCart(itemId, token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Clear cart
export const clearCart = createAsyncThunk("cart/clear", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await cartService.clearCart(token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.message = ""
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.cart = action.payload.cart
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload.cart
        state.message = action.payload.message
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload.cart
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload.cart
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = { items: [], totalAmount: 0 }
      })
  },
})

export const { reset } = cartSlice.actions
export default cartSlice.reducer
