import React from 'react';
import '../static/css/productPopup.css';
import { Button } from 'react-bootstrap';
import { FaCartPlus, FaInfoCircle, FaMinus, FaPlus, FaTimes } from 'react-icons/fa';

const ProductPopup = ({ product, onClose, onAddToCart, onDecrementProductQuantityInCart }) => {
    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-image">
                    <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} />
                </div>
                <div className="popup-details">
                    <h1 className="popup-title">{product.name}</h1>
                    <p className="popup-stock">Stock: {product.stock}</p>
                    <p className="popup-description">{product.description}</p>
                    <p className="popup-price">€{product.price}</p>
                    <div className="popup-options">
                        <label htmlFor="color">Color:</label>
                        <select id="color">
                            <option>Red</option>
                            <option>Green</option>
                            <option>Blue</option>
                        </select>

                        <label htmlFor="size">Size:</label>
                        <select id="size">
                            <option>Small</option>
                            <option>Medium</option>
                            <option>Large</option>
                        </select>
                    </div>
                    <div className="popup-actions">
                        {product.quantity >= 1 ? (
                            <div className="addCartDive">
                                <Button variant="outline-primary" onClick={onDecrementProductQuantityInCart}>
                                    <FaMinus />
                                </Button>
                                <span className="quantity-display">{product.quantity}</span>
                                <Button variant="outline-primary" onClick={onAddToCart}>
                                    <FaPlus />
                                </Button>
                            </div>
                        ) : (
                            <Button className="btn-add-to-cart" onClick={onAddToCart}>
                                <FaCartPlus /> Add to Cart
                            </Button>
                        )}
                        <Button className="btn-more-info">
                            <FaInfoCircle /> More Info
                        </Button>
                    </div>
                </div>
                <span className="btn-close"><FaTimes onClick={onClose}/></span>
                {/* <Button className="btn-close" onClick={onClose}>
                    <FaTimes />
                </Button> */}
            </div>
        </div>
    );
};

export default ProductPopup;
