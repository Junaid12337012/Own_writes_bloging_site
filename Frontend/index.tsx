
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { SavedPostsProvider } from './contexts/SavedPostsContext';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider } from './contexts/AuthContext';
import { LikedPostsProvider } from './contexts/LikedPostsContext';
import { ToastProvider } from './contexts/ToastContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <DataProvider>
          <AuthProvider>
            <ToastProvider>
              <SavedPostsProvider>
                <LikedPostsProvider>
                  <App />
                </LikedPostsProvider>
              </SavedPostsProvider>
            </ToastProvider>
          </AuthProvider>
        </DataProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);