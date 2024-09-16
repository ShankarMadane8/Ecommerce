import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import ProductCard from './ProductCard';
import '../static/css/dashboardContent.css';

const DashboardContent = ({ refresh, onUpdateNavbar }) => {
    const [products, setProducts] = useState([]);
    const [sortOption, setSortOption] = useState('');
    const [loadingProducts, setLoadingProducts] = useState(true);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoadingProducts(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [refresh]); // Fetch products whenever `refresh` changes

    const handleSort = (event) => {
        const option = event.target.value;
        setSortOption(option);

        if (option === 'lowToHigh') {
            setProducts((prevProducts) => [...prevProducts].sort((a, b) => a.price - b.price));
        } else if (option === 'highToLow') {
            setProducts((prevProducts) => [...prevProducts].sort((a, b) => b.price - a.price));
        }
    };

    console.log("DashboardContent render");

    return (
        <>
        <div>
            

        <Container className="dashboard-content">
            <div className="small-transparent-bg d-flex justify-content-end">
                <select 
                    value={sortOption} 
                    onChange={handleSort} 
                    className="custom-select">
                    <option value="">Sort By Price</option>
                    <option value="lowToHigh">Low to High</option>
                    <option value="highToLow">High to Low</option>
                </select>
            </div>

            {loadingProducts ? (
                <div className="spinner-container d-flex justify-content-center">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Row className="product-row">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <Col xs={6} sm={4} md={2} lg={2} key={product.id} className="mb-3">
                                <ProductCard product={product} onUpdate={() => { fetchProducts(); onUpdateNavbar(); }} />
                            </Col>
                        ))
                    ) : (
                        <div className="no-products">No products available.</div>
                    )}
                </Row>
            )}
        </Container>
        </div>
        </>
    );
};

export default DashboardContent;
