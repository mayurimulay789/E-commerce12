import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slice/authSlice"
import productReducer from "./slice/productSlice"
import cartReducer from "./slice/cartSlice"
import orderReducer from "./slice/orderSlice"
import categoryReducer from "./slice/categorySlice"
import wishlistReducer from "./slice/wishlist"
import addressReducer from "./slice/addressSlice"

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
