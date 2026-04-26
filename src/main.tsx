import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ color: 'red', fontSize: '50px', position: 'absolute', zIndex: 999 }}>
       
    </div>
    <App />
  </React.StrictMode>,
)