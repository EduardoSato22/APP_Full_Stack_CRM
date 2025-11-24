import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx' // Aqui ele puxa a sua configuração do App.tsx
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)