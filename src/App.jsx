import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { useState } from 'react';
import Layout from './Layout.jsx';
import LoginForm from '../components/LoginForm.jsx';
import Dashboard from '../components/Dashboard.jsx';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    const router = createBrowserRouter([
        {
            element: <Layout />,
            children: [
                {
                    path: '/',
                    element: token ? <Dashboard /> : <Navigate to="/login" />,
                },
                {
                    path: '/login',
                    element: <LoginForm onLogin={() => setToken(localStorage.getItem('token'))} />, // 🟢 update token state
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
