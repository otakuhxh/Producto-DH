import React, { useState } from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    if (user || localStorage.getItem('user')) {
        navigate('/profile');
    }

    return (
        <div className="page">
            <LoginForm onLogin={handleLogin} />
        </div>
    );
};

export default LoginPage;