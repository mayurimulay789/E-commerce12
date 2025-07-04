import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import addressService from "../../services/addressService"

const initialState = {
  addresses: [],
  isLoading: false,
  isError: false,
  message: "",
}

// Get addresses
export const getAddresses = createAsyncThunk("address/getAddresses", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await addressService.getAddresses(token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Add address
export const addAddress = createAsyncThunk("address/addAddress", async (addressData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await addressService.addAddress(addressData, token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Update address
export const updateAddress = createAsyncThunk("address/updateAddress", async ({ id, addressData }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await addressService.updateAddress(id, addressData, token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Delete address
export const deleteAddress = createAsyncThunk("address/deleteAddress", async (addressId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await addressService.deleteAddress(addressId, token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

// Set default address
export const setDefaultAddress = createAsyncThunk("address/setDefaultAddress", async (addressId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token
    return await addressService.setDefaultAddress(addressId, token)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

export const addressSlice = createSlice({
  name: "address",
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
      .addCase(getAddresses.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAddresses.fulfilled, (state, action) => {
        state.isLoading = false
        state.addresses = action.payload.addresses || []
      })
      .addCase(getAddresses.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses = action.payload.addresses || []
        state.message = "Address added successfully"
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.addresses = action.payload.addresses || []
        state.message = "Address updated successfully"
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = action.payload.addresses || []
        state.message = "Address deleted successfully"
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.addresses = action.payload.addresses || []
        state.message = "Default address updated"
      })
  },
})

export const { reset } = addressSlice.actions
export default addressSlice.reducer
