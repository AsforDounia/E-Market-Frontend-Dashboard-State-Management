import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import './index.css'
<<<<<<< HEAD
import App from './App.jsx'
import { Provider } from 'react-redux'
=======
import { router } from './routes/router.jsx'
>>>>>>> afd3ae0 (Integrate Redux for state management and add ProductsList component)
import store from './store/store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
