import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RedirectScreen from './RedirectScreen.tsx'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />} path='/'/>
        <Route element={<RedirectScreen/>} path='/:id'/>
      </Routes>
    </BrowserRouter>
 </React.StrictMode>,
)
