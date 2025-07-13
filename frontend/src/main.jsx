import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './context/AuthContext.jsx'
import { SelectedUserProvider } from './context/SelectedUserContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <SelectedUserProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </SelectedUserProvider>
    </BrowserRouter>

)
