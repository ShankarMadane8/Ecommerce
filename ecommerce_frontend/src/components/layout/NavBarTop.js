import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Modal, Button } from 'react-bootstrap';
import { FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../../static/css/navbarTop.css';
import ProductAddForm from '../ProductAddForm';
import CategoryAddForm from '../CategoryAddForm'; // Import the new CategoryAddForm

const NavbarTop = ({onUpdate,onUpdateNavbar}) => {
    const navigate = useNavigate();
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false); // State for category modal
    const [isAdmin, setIsAdmin] = useState(false);

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

    const handleLogout = () => {
        localStorage.removeItem('token');
         // Flush all cookies
    document.cookie.split(";").forEach(cookie => {
        const [name] = cookie.split("=");
        document.cookie = `${name}=; max-age=0; path=/;`;
    });
        navigate('/login');
    };

    const handleShowProductModal = () => setShowProductModal(true);
    const handleShowCategoryModal = () => setShowCategoryModal(true); // Show category modal

    const handleCloseProductModal = () => {
        setShowProductModal(false);
        onUpdate(); // Trigger refresh after closing the modal
    };

    const handleCloseCategoryModal = () => {
        setShowCategoryModal(false);
        onUpdateNavbar()
        // Trigger refresh after closing the modal
    };

    return (
        <>
            <Navbar bg="light" variant="light" className="justify-content-between navbar-top d-none d-md-flex">
                <Container>
                    <Navbar.Text>Free Shipping on orders over $50!</Navbar.Text>
                    <Nav className="ms-auto">
                        <Nav.Link href="#about">About Us |</Nav.Link>
                        <Nav.Link href="#contact">Contact Us |</Nav.Link>
                        <Nav.Link href="#account">My Account |</Nav.Link>
                        {isAdmin && (
                            <>
                                <Nav.Link as="button" onClick={handleShowCategoryModal}>
                                    Add Categories |
                                </Nav.Link>
                                <Nav.Link as="button" onClick={handleShowProductModal}>
                                    Add Product |
                                </Nav.Link>
                            </>
                        )}
                        <Nav.Link as="button" onClick={handleLogout} className="logout-icon">
                            <FaSignOutAlt size={20} /> Logout
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            {/* Product Modal */}
            <Modal show={showProductModal} onHide={handleCloseProductModal} size="lg">
                <Modal.Header>
                    <Modal.Title>Add New Product</Modal.Title>
                    <Button variant="link" onClick={handleCloseProductModal} className="close-btn">
                        <FaTimes className="close-btn" size={20} />
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <ProductAddForm handleClose={handleCloseProductModal} />
                </Modal.Body>
            </Modal>

            {/* Category Modal */}
            <Modal show={showCategoryModal} onHide={handleCloseCategoryModal} size="lg">
                <Modal.Header>
                    <Modal.Title>Add New Category</Modal.Title>
                    <Button variant="link" onClick={handleCloseCategoryModal} className="close-btn">
                        <FaTimes className="close-btn" size={20} />
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <CategoryAddForm handleClose={handleCloseCategoryModal} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default NavbarTop;
