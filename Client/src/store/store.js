import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import productReducer from "./slices/productSlice"
import cartReducer from "./slices/cartSlice"
import orderReducer from "./slices/orderSlice"
import categoryReducer from "./slices/categorySlice"
import wishlistReducer from "./slices/wishlistSlice"
import addressReducer from "./slices/addressSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    categories: categoryReducer,
    wishlist: wishlistReducer,
    address: addressReducer,
  },
})
