import { Toaster } from "react-hot-toast"

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: "",
        duration: 4000,
        style: {
          background: "#363636",
          color: "#fff",
          borderRadius: "8px",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "500",
        },

        // Default options for specific types
        success: {
          duration: 3000,
          style: {
            background: "#10B981",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#10B981",
          },
        },

        error: {
          duration: 4000,
          style: {
            background: "#EF4444",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#EF4444",
          },
        },

        loading: {
          style: {
            background: "#6B7280",
          },
        },
      }}
    />
  )
}

export default Toast
