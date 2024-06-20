import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./queryClient";

const checkAndUpdateData = async (): Promise<void> => {
  try {
    const response = await fetch("/data.json");
    const newData = await response.json();

    const currentData = localStorage.getItem("users");
    if (currentData !== JSON.stringify(newData)) {
      localStorage.setItem("users", JSON.stringify(newData));
      // Optionally, notify user or trigger a UI update here
    }
  } catch (error) {
    console.error("Error fetching or storing data:", error);
  }
};

// Call checkAndUpdateData periodically (e.g., using setInterval)
setInterval(checkAndUpdateData, 60000); // Check every minute

fetch("/data.json")
  .then((response) => response.json())
  .then((data) => {
    localStorage.setItem("users", JSON.stringify(data)); // Overwrite localStorage with updated data
  })
  .catch((error) => console.error("Error fetching or storing data:", error));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
