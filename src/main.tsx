import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import './theme.less'
import { RouterProvider } from 'react-router-dom'
import router from './router.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </StrictMode>,
)
