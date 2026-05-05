import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@/styles/globals.css';
import '@/styles/ussd-fix.css';

// Clear stale query cache and force fresh auth token on every app start
sessionStorage.clear();
localStorage.clear(); // always start fresh — auth store will rehydrate from code defaults

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
