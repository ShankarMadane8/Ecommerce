import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Utility function to decode JWT token and check expiration
const decodeToken = (token) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Get current time in seconds
        if (decoded.exp && decoded.exp < currentTime) {
            // Token is expired
            localStorage.removeItem('token');
            return null;
        }
        return decoded;
    } catch (e) {
        return null;
    }
};

const ProtectedRoute = ({ element, roles }) => {
    const token = localStorage.getItem('token');
    const decodedToken = token ? decodeToken(token) : null;
    const userRole = decodedToken ? decodedToken.role : null; // Extract role from token

    // Check if the user is authenticated
    if (!token || !decodedToken) {
        return <Navigate to="/login" />;
    }

    // Check if the user has the required role
    if (roles && !roles.includes(userRole)) {
        return <Navigate to="/unauthorized" />;
    }

    // Render the component if the user is authenticated and has the right role
    return element;
};

export default ProtectedRoute;
