import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./queryClient";

fetch("/data.json")
  .then((response) => response.json())
  .then((data) => {
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify(data));
    }
  })
  .catch((error) => console.error("Error fetching or storing data:", error)); // Add error handling

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
