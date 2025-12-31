import React, { useState } from 'react';
import { X, User, Lock, Mail, MapPin } from 'lucide-react';
import { useUser } from '../context/UserContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
    const [isRegister, setIsRegister] = useState(false);
    const { login } = useUser();

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        city: ''
    });
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const endpoint = isRegister ? '/api/auth/signup' : '/api/auth/login';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Authentication failed');
                return;
            }

            // Success
            if (isRegister) {
                // If specific response data contains instructions, we could use it.
                // Switch to login view
                setIsRegister(false);
                setError('Account created! Please log in.');
                // Clear password field for UX
                setFormData(prev => ({ ...prev, password: '' }));
            } else {
                login(data.user);
                onClose();
            }

        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content fade-in">
                <button className="close-btn" onClick={onClose}><X size={24} /></button>

                <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
                <p>{isRegister ? "Join for free to save locations" : "Sign in to your account"}</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {isRegister && (
                        <>
                            <div className="input-group">
                                <User size={18} />
                                <input name="fullName" type="text" placeholder="Full Name" required onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <MapPin size={18} />
                                <input name="city" type="text" placeholder="City (for default weather)" onChange={handleChange} />
                            </div>
                        </>
                    )}

                    <div className="input-group">
                        <Mail size={18} />
                        <input name="email" type="email" placeholder="Email" required onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <Lock size={18} />
                        <input name="password" type="password" placeholder="Password" required onChange={handleChange} />
                    </div>

                    <button type="submit" className="auth-submit">
                        {isRegister ? "Sign Up" : "Log In"}
                    </button>
                </form>

                <div className="switch-mode">
                    {isRegister ? "Already have an account? " : "Don't have an account? "}
                    <span onClick={() => { setIsRegister(!isRegister); setError(''); }}>
                        {isRegister ? "Log In" : "Sign Up"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
