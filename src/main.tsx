// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './queryClient';

// Load data into local storage
fetch('/data.json')
  .then(response => response.json())
  .then(data => {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify(data));
    }
  });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
