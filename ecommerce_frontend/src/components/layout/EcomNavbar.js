import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navbar, Container, Nav, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaUserCircle, FaBell } from 'react-icons/fa';
import '../../static/css/ecomNavbar.css'; 

const EcomNavbar = () => {
    const [isSticky, setSticky] = useState(false);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const handleScroll = () => {
            setSticky(window.scrollY > 50); // Adjust 50px as needed
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    
    const fetchTotalQuantity = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/cart/total-quantity', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTotalQuantity(response.data.totalQuantity || 0);
        } catch (error) {
            console.error('Failed to fetch total quantity:', error);
        }
    };

    // Fetch total quantity on component mount
    useEffect(() => {
        fetchTotalQuantity();
    }, []);

    // You might want to include a way to refresh the total quantity when adding items to the cart
    // For instance, after a successful add to cart action, call `fetchTotalQuantity()`
    fetchTotalQuantity();
    console.log("EcomNavbar render")

    


    useEffect(() => {
        // Fetch categories from the backend
        const fetchCategories = async () => {
          try {
            const response = await axios.get('http://localhost:5000/api/categories', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            setCategories(response.data); // Assuming the categories are in the data field
            // console.log(response.data.data)
          } catch (error) {
            console.error('Error fetching categories:', error);
          }
        };
    
        fetchCategories();
      }, []);

      
    return (
        <>
            <Navbar  variant="dark" expand="lg" className={`ecom-navbar ${isSticky ? 'sticky' : ''}`}>
                <Container>
                    <Navbar.Brand as={Link} to="/dashboard">EcomSite</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <div className="d-flex flex-grow-1 mx-10">
                            <InputGroup className="w-100">
                                <Form.Control
                                    type="search"
                                    placeholder="Search"
                                    className="search-input"
                                    aria-label="Search"
                                />
                                <InputGroup.Text className="search-icon">
                                    <button className="search-button">
                                        <FaSearch />
                                    </button>
                                </InputGroup.Text>
                            </InputGroup>
                        </div>

                        <Nav>
                            <Nav.Link as={Link} to="/notifications" className="icon">
                                <FaBell size={24} /> {/* Notification icon */}
                            </Nav.Link>
                            <Nav.Link as={Link} to="/cart" className="icon position-relative">
                                <FaShoppingCart size={28} /> {/* Increased icon size */}
                                {totalQuantity > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {totalQuantity}
                                    </span>
                                )}
                            </Nav.Link>
                            <Nav.Link as={Link} to="/profile" className="icon">
                                <FaUserCircle size={24} /> {/* Profile icon */}
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className={`navbar-extra ${isSticky ? 'sticky-extra' : ''}`} >
                <Container>
                    <Nav className="justify-content-between">
                        <Nav className="left-links">
                        <Dropdown align="end">
                                <Dropdown.Toggle variant="light" id="dropdown-basic">
                                    Categories
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {categories.map((category) => (
                                      <Dropdown.Item as={Link} to={`/categories/${category.id}`} key={category.id}>{category.name}</Dropdown.Item>
                                    ))}
                                    
                                </Dropdown.Menu>
                            </Dropdown>
                            
                            <Nav.Link as={Link} to="/about">About Us</Nav.Link>
                            <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
                            <Nav.Link as={Link} to="/pages">Pages</Nav.Link>
                            <Nav.Link as={Link} to="/offers">Offers</Nav.Link>
                        </Nav>

                        <Nav className="right-links">
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="light" id="dropdown-basic">
                                    English
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to="/english">English</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/spanish">Spanish</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/french">French</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Nav.Link as={Link} to="/privacy">Privacy Policy</Nav.Link>
                            <Nav.Link as={Link} to="/terms">Terms & Conditions</Nav.Link>
                        </Nav>
                    </Nav>
                </Container>
            </div>
        </>
    );
};

export default EcomNavbar;
