import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../static/css/cart.css';
import { Col, Row, Button } from 'react-bootstrap';
import { FaTag, FaDollarSign, FaShippingFast, FaCheckCircle, FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';
import axios from 'axios';

const Cart = ({ onUpdateCart }) => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);

    const handleAddToCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/cart/add',
                { productId: productId },
                {
                   
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            fetchCartItems();
            onUpdateCart();
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const handleDecrementProductQuantityInCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/cart/decrement',
                { productId: productId },
                {
                   
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            fetchCartItems();
            onUpdateCart();
        } catch (error) {
            console.error('Error decrementing item quantity:', error);
        }
    };

    const handleRemoveFromCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `http://localhost:5000/api/cart/clear/${productId}`,
                {
                    
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            fetchCartItems(); 
            onUpdateCart();
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const fetchCartItems = () => {
        const token = localStorage.getItem('token');
        fetch("http://localhost:5000/api/cart", {
            method: 'GET',
            headers: {  
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("data: ",data)
                setCartItems(data);
                let calculatedTotal = 0;
                let calculatedDiscount = 0;
                let calculatedFinalTotal = 0;

                data.forEach(item => {
                    const finalPrice = item.discount ? (item.price - (item.price * item.discount / 100)) : item.price;
                    const discountAmount = item.price * item.discount / 100;
                    
                    calculatedTotal += item.price * item.quantity;
                    calculatedDiscount += discountAmount * item.quantity;
                    calculatedFinalTotal += finalPrice * item.quantity;
                });

                setTotal(calculatedTotal);
                setTotalDiscount(calculatedDiscount);
                setFinalTotal(calculatedFinalTotal);
            })
            .catch(error => console.error('Error fetching cart items:', error));
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const deliveryCharge = 0;


    const totalItem = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="cart-container">
            <h2 className="cart-title">Shopping Cart</h2>
            <Row>
                <Col md={8} lg={{ span: 7, offset: 1 }}>
                    <div className="cart-items">
                        {cartItems.map((item) => {
                            const finalPrice = item.discount ? (item.price - (item.price * item.discount / 100)).toFixed(2) : item.price.toFixed(2);
                            return (
                                <div key={item.id} className="cart-item mb-3">
                                    <div className="cart-item-image">
                                        <img src={item.image ? `data:image/png;base64,${item.image}` : `https://via.placeholder.com/150?text=Image+${item.id}`} alt={item.name} />
                                    </div>
                                    <div className="cart-item-info">
                                        <h5> <span>Brand: {item.brand}</span>, <span>{item.name}</span></h5>
                                        <h5>{item.description}</h5>
                                        <p className="price-info">
                                            <span className="original-price">Price: ₹{item.price.toFixed(2)}</span>
                                            <span className="discount">Discount: {item.discount}%</span>
                                        </p>
                                        {/* <p className="final-price">Final Price: ₹{finalPrice}</p> */}
                                        <p className="final-price">Final Price: ₹{(finalPrice * item.quantity).toFixed(2)}</p>
                                        {/* <p>Total Amount: ₹{(finalPrice * item.quantity).toFixed(2)}</p> */}
                                        <div className="cart-item-actions">
                                            <Button variant="outline-primary" onClick={() => handleDecrementProductQuantityInCart(item.productId)}><FaMinus /></Button>
                                            <Button className='ml-5' variant="outline-primary">{item.quantity}</Button>
                                            <Button className='ml-5' variant="outline-primary" onClick={() => handleAddToCart(item.productId)}><FaPlus /></Button>
                                            <Button className='ml-5' variant="outline-danger" onClick={() => handleRemoveFromCart(item.productId)}><FaTrashAlt /></Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Col>
                <Col md={4} lg={4}>
                    <div className="price-detail fixed-position">
                        <div className="price-detail-item">
                            <FaDollarSign className="icon" />
                            {/* <h4>Price ({cartItems.length} items)</h4> */}
                            <h4>Price ({totalItem} items)</h4>
                            
                            <h3>₹{total.toFixed(2)}</h3>
                        </div>
                        <div className="price-detail-item">
                            <FaTag className="icon" />
                            <h4>Discount</h4>
                            <h3>− ₹{totalDiscount.toFixed(2)}</h3>
                        </div>
                        <div className="price-detail-item">
                            <FaShippingFast className="icon" />
                            <h4>Delivery Charges</h4>
                            <h3>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toFixed(2)}`}</h3>
                        </div>
                        <hr />
                        <div className="price-detail-item">
                            <FaCheckCircle className="icon" />
                            <h4>Total Amount</h4>
                            <h3>₹{finalTotal.toFixed(2)}</h3>
                        </div>
                        <hr />
                        <h5 className="savings-message">You will save ₹{totalDiscount.toFixed(2)} on this order</h5>
                        <Button className="btn btn-primary checkout-button">Proceed to Checkout</Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Cart;
