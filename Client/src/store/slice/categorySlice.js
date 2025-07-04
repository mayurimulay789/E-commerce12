import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import categoryService from "../../services/categoryService"

const initialState = {
  categories: [],
  isLoading: false,
  isError: false,
  message: "",
}

// Get all categories
export const getCategories = createAsyncThunk("categories/getAll", async (_, thunkAPI) => {
  try {
    return await categoryService.getCategories()
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

export const categorySlice = createSlice({
  name: "categories",
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
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false
        state.categories = action.payload.categories
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = categorySlice.actions
export default categorySlice.reducer
