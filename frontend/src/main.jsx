import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminPanel from "./pages/AdminPanel.jsx"

import './index.css'
import UploadDocument from './pages/UploadDocument.jsx'
import App from './App.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { CharitiesJarsPage } from './pages/CharitiesJars.jsx'
import { UserProfile } from './pages/UserProfile.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/upload/:address" element={<UploadDocument />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/jars' element={<CharitiesJarsPage />} />
        <Route path='/profile' element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)