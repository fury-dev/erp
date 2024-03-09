import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { store } from './store/index.tsx';
import config from './config';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import ErrorBoundary from './error/ErrorBoundary.tsx';
import './i18n/i18n.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={config.basename}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
