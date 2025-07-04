import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { HelmetProvider } from "react-helmet-async"
import { Toaster } from "react-hot-toast"
import App from "./App.jsx"
import { store } from "./store/store.js"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      
        <HelmetProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                theme: {
                  primary: "#4aed88",
                },
              },
            }}
          />
        </HelmetProvider>
    </Provider>
  </React.StrictMode>,
)
