import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/linkedin.css';
import '@capacitor/core';
import { initSentry } from './lib/sentry';

initSentry();

if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn('VITE_API_BASE_URL is not defined. Using default API URL.');
}

// NOTE: <React.StrictMode> is applied inside <App /> only — wrapping it here too
// caused effects to run 4× in dev and was duplicate work in prod tree-walks.
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
