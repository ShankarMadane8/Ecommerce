import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const CategoryAddForm = ({ handleClose }) => {
    const [categoryName, setCategoryName] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset messages
        setSuccessMessage('');
        setErrorMessage('');

        // Creating the payload for the POST request
        const categoryData = {
            name: categoryName
        };

        try {
            const response = await fetch('http://localhost:5000/api/categories', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                   Authorization: `Bearer ${localStorage.getItem('token')}`

                },
                body: JSON.stringify(categoryData)
            });

            if (response.ok) {
                setSuccessMessage('Category added successfully!');
                setCategoryName(''); // Clear the form
                // handleClose(); // Optionally close the form
            } else {
                setErrorMessage('Failed to add category. Please try again.');
            }
        } catch (error) {
            setErrorMessage(`Error: ${error.message}`);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <Form.Group controlId="categoryName">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
                Add Category
            </Button>
        </Form>
    );
};

export default CategoryAddForm;
