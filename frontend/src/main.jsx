import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './app/store.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap the app in the Provider and pass in the store */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
