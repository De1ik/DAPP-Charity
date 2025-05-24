import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminPanel from "./pages/AdminPanel.jsx"

import './index.css'
import UploadDocument from './UploadDocument.jsx'
// import CreateJarPage from './pages/CreateJar.jsx'
import { CreateJarPage } from './pages/CreateJar.jsx'


import UploadDocument from './pages/UploadDocument.jsx'
import App from './App.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { CharitiesJarsPage } from './pages/CharitiesJars.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/upload/:address" element={<UploadDocument />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create-jar" element={<CreateJarPage />} />
        <Route path='/jars' element={<CharitiesJarsPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)