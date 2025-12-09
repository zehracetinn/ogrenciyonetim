import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'  // <-- DİKKAT: Burası App.css olmalı (senin dosya adına göre)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)