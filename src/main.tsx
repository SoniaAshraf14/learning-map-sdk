import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GetMapORS from './components/GetMapORS'
// import './index.css'
// import App from './App.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GetMapORS/>
  </StrictMode>,
)
