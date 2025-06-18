// LoginForm.jsx
import { useState } from 'react';
import axios from 'axios';

export default function LoginForm({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        const res = await axios.post('http://145.24.223.203:80/users/login', { email, password });
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            onLogin(res.data.user);
        }
    };

    return (
        <div>
            <h2>Inloggen</h2>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Wachtwoord" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={login}>Login</button>
        </div>
    );
}
