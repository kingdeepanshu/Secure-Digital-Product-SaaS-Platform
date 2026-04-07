import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { setAuthToken } from "./services/api";

const token = localStorage.getItem("token");
if (token) {
  setAuthToken(token);
}

console.log(token);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
