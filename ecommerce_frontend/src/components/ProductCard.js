import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Alert } from 'react-bootstrap';
import { FaShoppingBag, FaTag, FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa'; // Import Edit and Trash icons
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../static/css/productCard.css';
import ProductPopup from './ProductPopup';
import ProductUpdateForm from './ProductUpdateForm'; // Import the update form component

const ProductCard = ({ product, onUpdate }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false); // Confirm delete modal state
    const [showUpdateForm, setShowUpdateForm] = useState(false); // Update form modal state
    const [error, setError] = useState(null); // Error state
    console.log("product: ",product)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const role = decodedToken.role || [];
                if (role.includes('ADMIN')) {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }
    }, []);
    const handlerUpdateProduct = () => {
        setShowUpdateForm(false)
        onUpdate(); // Trigger refresh after closing the modal
    };
    const handleIconClick = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/cart/add',
                { productId: product.id },
                {
        
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const handleDecrementProductQuantityInCart = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/cart/decrement',
                { productId: product.id },
                {
                    
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error decrementing item quantity:', error);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `http://localhost:5000/api/products/${product.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (onUpdate) onUpdate();
            setShowConfirmDelete(false); // Close the confirm delete modal
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Failed to delete product. Please try again later.');
        }
    };

    const discountedPrice = product.discount ? (product.price - (product.price * product.discount / 100)).toFixed(2) : null;

    return (
        <>
            <Card className="product-card">
                <div className="image-container">
                    {product.discount > 0 && product.discount !== null && (
                        <span className="offer-label">
                            <FaTag /> {product.discount}% OFF
                        </span>
                    )}
                    <span className="stock-label">
                        Stock: {product.stock || 'N/A'}
                    </span>
                    <Card.Img
                        variant="top"
                        src={`data:image/jpeg;base64,${product.image}`}
                        className="product-image"
                        onClick={handleIconClick}
                    />
                </div>
                <Card.Body className="product-body">
                    <Card.Title className="product-name">{product.name}</Card.Title>
                    <Card.Text className="product-brand">{product.brand}</Card.Text>
                    <div className="price-container">
                        {discountedPrice ? (
                            <>
                                <span className="original-price">${product.price.toFixed(2)}</span>
                                <span className="discounted-price"> ${discountedPrice}</span>
                            </>
                        ) : (
                            <span className="current-price">${product.price.toFixed(2)}</span>
                        )}
                    </div>
                    {product.quantity >= 1 ? (
                        <div className="quantity-control shopping-bag-icon">
                            <Button variant="outline-primary" onClick={handleDecrementProductQuantityInCart}>-</Button>
                            <span className="quantity-display">{product.quantity}</span>
                            <Button variant="outline-primary" onClick={handleAddToCart}>+</Button>
                        </div>
                    ) : (
                        <FaShoppingBag
                            className="shopping-bag-icon"
                            onClick={handleAddToCart}
                        />
                    )}
                    
                    {isAdmin && (
                        <div className="admin-icons">
                            <FaEdit
                                className="edit-icon"
                                size={20}
                                onClick={() => setShowUpdateForm(true)} // Show update form modal
                            />
                            <FaTrashAlt
                                className="delete-icon"
                                size={20}
                                onClick={() => setShowConfirmDelete(true)} // Show confirm delete modal
                            />
                        </div>
                    )}
                </Card.Body>
            </Card>

            {showPopup && (
                <ProductPopup
                    product={product}
                    onClose={handleClosePopup}
                    onAddToCart={handleAddToCart}
                    onDecrementProductQuantityInCart={handleDecrementProductQuantityInCart}
                />
            )}

            {/* Confirm Delete Modal */}
            <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this product?
                    {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteProduct}>Delete</Button>
                </Modal.Footer>
            </Modal>

            {/* Update Product Modal */}
            {showUpdateForm && (
                <Modal show={showUpdateForm} onHide={() => setShowUpdateForm(false)}>
                    <Modal.Header >
                        <Modal.Title>Update Product</Modal.Title>
                        <Button variant="link"  onClick={handlerUpdateProduct}  >
                        <FaTimes className="close-btn" size={20} />
                    </Button>
                    </Modal.Header>
                    <Modal.Body>
                        <ProductUpdateForm product={product} handleClose={handlerUpdateProduct}  />
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

export default ProductCard;
