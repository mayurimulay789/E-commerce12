import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import wishlistService from "../../services/wishlistService"

const initialState = {
  items: [],
  isLoading: false,
  isError: false,
  message: "",
}

// Get wishlist
export const getWishlist = createAsyncThunk("wishlist/getWishlist", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await wishlistService.getWishlist(token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Add to wishlist
export const addToWishlist = createAsyncThunk("wishlist/addToWishlist", async (productId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await wishlistService.addToWishlist(productId, token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk("wishlist/removeFromWishlist", async (productId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await wishlistService.removeFromWishlist(productId, token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Clear wishlist
export const clearWishlist = createAsyncThunk("wishlist/clearWishlist", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await wishlistService.clearWishlist(token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

export const wishlistSlice = createSlice({
  name: "wishlist",
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
      .addCase(getWishlist.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.wishlist || []
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload.wishlist || []
        state.message = "Item added to wishlist"
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload.wishlist || []
        state.message = "Item removed from wishlist"
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = []
        state.message = "Wishlist cleared"
      })
  },
})

export const { reset } = wishlistSlice.actions
export default wishlistSlice.reducer
