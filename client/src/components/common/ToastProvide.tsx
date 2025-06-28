import React from "react";
import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#333",
          color: "#fff",
          borderRadius: "8px",
          padding: "16px",
        },
        success: {
          iconTheme: {
            primary: "#4CAF50",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#f44336",
            secondary: "#fff",
          },
        },
      }}
    />
  );
};

export default ToastProvider;
