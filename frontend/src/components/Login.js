import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const location = useLocation()
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(()=>{
        if(location.pathname === '/'){
            localStorage.removeItem('accessToken')
        }
 
    })

    const handleRegister = () => {
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if email or password is empty
        if (!email || !password) {
            setErrorMessage('Please enter both email and password.');
            return;
        }
         
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', { email, password });

            if (response.status === 200) {

                const token = response.data.token;
                localStorage.setItem('accessToken', token);
                navigate('/AllProducts');

            } else {
                setErrorMessage('Login failed. Please try again.');
                console.error('Login failed:', response.data.message);
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
            setErrorMessage('An error occurred during login. Please try again later.');
        }
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-dark">
    <div className="login-form p-5 rounded shadow bg-dark" style={{ width: '400px', border: 'none' }}>
        <h3 className="text-center mb-4 text-light">Welcome Back!</h3>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form onSubmit={handleSubmit} className="bg-transparent">
            <Form.Group controlId="formUsername" className="mb-3">
                <Form.Label className="text-light">Email</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-pill"
                />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label className="text-light">Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-pill"
                />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 rounded-pill mb-3" >
                Login
            </Button>

            <Button variant="outline-primary" className="w-100 rounded-pill" onClick={handleRegister}>
                Sign Up
            </Button>
        </Form>
    </div>
</Container>
    );
};

export default Login;