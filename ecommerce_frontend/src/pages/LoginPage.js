import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { OauthSender } from 'react-oauth-flow';
import { FaGithub, FaLinkedin, FaFacebook } from 'react-icons/fa'; // Add Facebook icon
import '../static/css/login.css';

const LoginPage = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });
            localStorage.setItem('token', response.data.token);
            console.log(response.data)
            navigate('/dashboard');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Login failed. Please check your credentials and try again.';
            console.log("error: ",error)

            toast.error(errorMessage);
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get('code');
        const provider = queryParams.get('provider'); 
        if (code && provider) {
            const fetchAccessToken = async () => {
                try {
                    const response = await axios.post(`http://localhost:5000/auth/${provider}/callback`, { code });
                    localStorage.setItem('token', response.data.token);
                    navigate('/dashboard');
                } catch (error) {
                    console.log("error: ", error);
                    toast.error('Please Wait....');
                }
            };

            fetchAccessToken();
        }
    }, [navigate]);

    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp && decoded.exp < currentTime) {
                localStorage.removeItem('token');
                return null;
            }
            return decoded;
        } catch (e) {
            return null;
        }
    };

    const token = localStorage.getItem('token');
    const decodedToken = token ? decodeToken(token) : null;

    if (token || decodedToken) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="login-form-container">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                closeOnClick
                pauseOnHover
                draggable
                toastClassName="toast-container"
                bodyClassName="toast-body"
            />
            <div className="login-form">
                <h2 className="text-center">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="btn btn-block">Login</button>
                </form>
                <OauthSender
                    authorizeUrl="https://github.com/login/oauth/authorize"
                    clientId="Ov23limPvurAUkypiyUp"
                    redirectUri="http://localhost:3000/login?provider=github"
                    render={({ url }) => (
                        <a href={url} className="btn btn-dark btn-github">
                            <FaGithub /> Login with GitHub
                        </a>
                    )}
                />
                <OauthSender
                    authorizeUrl="https://www.linkedin.com/oauth/v2/authorization"
                    clientId="771apgs97hek9l" // replace with your LinkedIn Client ID
                    redirectUri="http://localhost:3000/login?provider=linkedin"
                    scope="r_liteprofile r_emailaddress"
                    render={({ url }) => (
                        <a href={url} className="btn btn-blue btn-linkedin">
                            <FaLinkedin /> Login with LinkedIn
                        </a>
                    )}
                />
                <OauthSender
                    authorizeUrl="https://www.facebook.com/v10.0/dialog/oauth"
                    clientId="1177202586887125" // replace with your Facebook Client ID
                    redirectUri="http://localhost:3000/login?provider=facebook"
                    scope="email public_profile"
                    render={({ url }) => (
                        <a href={url} className="btn btn-primary btn-facebook">
                            <FaFacebook /> Login with Facebook
                        </a>
                    )}
                />
                <div className="register-link">
                    <button onClick={() => navigate('/register')} className="btn btn-secondary">Register</button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
