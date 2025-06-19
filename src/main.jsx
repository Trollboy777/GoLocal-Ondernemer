import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'; // Zorg dat deze CSS daadwerkelijk geïmporteerd is
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
