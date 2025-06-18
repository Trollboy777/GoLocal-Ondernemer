import { useState } from 'react';
import {useNavigate} from "react-router";

export default function LoginForm({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate()

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
                setErrorMsg('Alleen ondernemers hebben toegang tot dit platform.');
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
        <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
            <h2>Inloggen</h2>
            <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: 10, marginBottom: 10 }}
            />
            <input
                type="password"
                placeholder="Wachtwoord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: 10, marginBottom: 10 }}
            />
            <button onClick={login} style={{ width: '100%', padding: 10 }}>
                Login
            </button>
            {errorMsg && <p style={{ color: 'red', marginTop: 10 }}>{errorMsg}</p>}
        </div>
    );
}
