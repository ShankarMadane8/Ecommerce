import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../static/css/registrationForm.css';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phoneNo: '',
        password: '',
        userType: 'CUSTOMER'
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.firstName) errors.firstName = 'First name is required';
        if (!formData.lastName) errors.lastName = 'Last name is required';
        if (!formData.phoneNo) errors.phoneNo = 'Phone number is required';
        if (!formData.password) errors.password = 'Password is required';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post('http://localhost:8181/users/register', formData);
            if (response.data.statusCode !== 200) {
                toast.error(response.data.responseDescription);
            } else {
                toast.success('User registered successfully!');
                setFormData({
                    email: '',
                    firstName: '',
                    lastName: '',
                    phoneNo: '',
                    password: '',
                    userType: 'CUSTOMER'
                });
                setErrors({});
                navigate('/login');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.responseDescription || 'Registration failed! Please try again.';
            console.log("error: ",error)
            toast.error(errorMessage);
            setErrors(error.response?.data?.errors || {});
        }
    };

    return (
        <div className="registration-form-container">
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
            <form className="registration-form" onSubmit={handleSubmit}>
                <h2 className="text-center">User Registration</h2>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="Enter your email"
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        placeholder="Enter your first name"
                    />
                    {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        placeholder="Enter your last name"
                    />
                    {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNo">Phone Number</label>
                    <input
                        type="text"
                        id="phoneNo"
                        name="phoneNo"
                        value={formData.phoneNo}
                        onChange={handleChange}
                        className={`form-control ${errors.phoneNo ? 'is-invalid' : ''}`}
                        placeholder="Enter your phone number"
                    />
                    {errors.phoneNo && <div className="error-message">{errors.phoneNo}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Enter your password"
                    />
                    {errors.password && <div className="error-message">{errors.password}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="userType">User Type</label>
                    <select
                        id="userType"
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="CUSTOMER">Customer</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ENGINEER">Engineer</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary btn-block">Register</button>
                <div className="login-link">
                    <button onClick={() => navigate('/login')} className="btn btn-secondary">Login</button>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;
