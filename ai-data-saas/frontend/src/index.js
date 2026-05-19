import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// ADD THIS LINE
import { DataProvider } from './context/DataContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* WRAP THE APP HERE */}
    <DataProvider> 
      <App />
    </DataProvider>
  </React.StrictMode>
);