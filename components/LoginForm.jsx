import { useState } from 'react';
import { useNavigate } from 'react-router'; // Gebruik react-router-dom voor useNavigate

export default function LoginForm({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    async function login() {
        try {
            const response = await fetch('http://145.24.223.203:80/users/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMsg(data.message || 'Login mislukt');
                return;
            }

            if (data.user?.role !== 'ondernemer') {
                setErrorMsg('Alleen ondernemers hebben toegang tot dit platform. bent u ondernemer? maak uw account dan aan via de app.');
                return;
            }

            localStorage.setItem('token', data.token);
            if (onLogin) onLogin();
            navigate('/');
        } catch (error) {
            console.error('Login fout:', error);
            setErrorMsg('Netwerkfout. Probeer opnieuw.');
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Inloggen</h2>
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">E-mailadres</label>
                <input
                    type="email"
                    id="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Wachtwoord</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Wachtwoord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <button
                onClick={login}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-150 ease-in-out"
            >
                Login
            </button>
            {errorMsg && (
                <p className="text-red-500 text-center mt-4 text-sm">
                    {errorMsg}
                </p>
            )}

            <div className="mt-6 text-center text-gray-600 text-sm">
                <p>Nog geen ondernemers account? Maak deze dan aan via de app en selecteer de rol **ondernemer**.</p>
            </div>
        </div>
    );
}