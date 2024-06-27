import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./queryClient";

const errorMessageStorage = 'Error fetching or storing data:';

fetch("/data.json")
  .then((response) => response.json())
  .then((data) => {
    localStorage.setItem("users", JSON.stringify(data));
  })
  .catch((error) => console.error(errorMessageStorage, error));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
