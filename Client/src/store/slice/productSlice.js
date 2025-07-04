import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import productService from "../../services/productService"

const initialState = {
  products: [],
  product: null,
  featuredProducts: [],
  trendingProducts: [],
  isLoading: false,
  isError: false,
  message: "",
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
  },
}

// Get all products
export const getProducts = createAsyncThunk("products/getAll", async (params, thunkAPI) => {
  try {
    return await productService.getProducts(params)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Get product by ID
export const getProduct = createAsyncThunk("products/getById", async (id, thunkAPI) => {
  try {
    return await productService.getProduct(id)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Get featured products
export const getFeaturedProducts = createAsyncThunk("products/getFeatured", async (_, thunkAPI) => {
  try {
    return await productService.getProducts({ featured: true, limit: 8 })
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Get trending products
export const getTrendingProducts = createAsyncThunk("products/getTrending", async (_, thunkAPI) => {
  try {
    return await productService.getProducts({ trending: true, limit: 8 })
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Add review
export const addReview = createAsyncThunk("products/addReview", async ({ productId, reviewData }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await productService.addReview(productId, reviewData, token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.message = ""
    },
    clearProduct: (state) => {
      state.product = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = action.payload.products
        state.pagination = action.payload.pagination
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.product = action.payload.product
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload.products
      })
      .addCase(getTrendingProducts.fulfilled, (state, action) => {
        state.trendingProducts = action.payload.products
      })
  },
})

export const { reset, clearProduct } = productSlice.actions
export default productSlice.reducer
