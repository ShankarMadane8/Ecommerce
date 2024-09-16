import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Alert, Form, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import '../static/css/productAddForm.css'; // Import your custom CSS (optional)

const ProductUpdateForm = ({ product, handleClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    discount: '',
    stock: '',
    image: null
  });

  const [categories, setCategories] = useState([]); // State to store categories
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [existingImage, setExistingImage] = useState(''); // State to store existing image

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
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();

    // Populate form data with the product data
    console.log("product.category_id: ",product.category_id
    )
    if (product) {
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        category: product.category_id || '',
        description: product.description || '',
        price: product.price || '',
        discount: product.discount || '',
        stock: product.stock || '',
        image: null // Reset image so we can handle preview separately
      });

      // Set existing image if available
      setExistingImage(product.image || '');
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.brand.trim()) errors.brand = 'Brand is required';
    if (!formData.category) errors.category = 'Please select a valid category';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) errors.price = 'Valid price is required';
    if (formData.discount === '' || parseFloat(formData.discount) < 0) errors.discount = 'Valid discount is required';
    if (formData.stock === '' || parseInt(formData.stock, 10) < 0) errors.stock = 'Valid stock is required';
    if (!formData.image && !existingImage) errors.image = 'Image is required';

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const form = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) { // Append only if value is not null
        form.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.patch(`http://localhost:5000/api/products/${product.id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuccessMessage('Product updated successfully');
      // handleClose(); 
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error updating product');
    }
  };

  return (
    <div className="product-add-form-container rounded-lg">
      <div className="product-add-form-box">
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form onSubmit={handleSubmit}>
          <FormGroup className="mb-3">
            <FormLabel>Name</FormLabel>
            <FormControl
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="common-input"
            />
            {validationErrors.name && <div className="error-text">{validationErrors.name}</div>}
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel>Brand</FormLabel>
            <FormControl
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="common-input"
            />
            {validationErrors.brand && <div className="error-text">{validationErrors.brand}</div>}
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel>Category</FormLabel>
            <FormControl
              as="select"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="common-input"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}
                >
                  {category.name}
                </option>
              ))}
            </FormControl>
            {validationErrors.category && <div className="error-text">{validationErrors.category}</div>}
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel>Image</FormLabel>
            {existingImage && !formData.image && (
              <div className="image-preview">
                <img
                  src={`data:image/jpeg;base64,${existingImage}`}
                  alt="Product"
                  className="img-thumbnail"
                />
              </div>
            )}
            <FormControl
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="common-input"
            />
            {validationErrors.image && <div className="error-text">{validationErrors.image}</div>}
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel>Description</FormLabel>
            <FormControl
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="common-input"
            />
            {validationErrors.description && <div className="error-text">{validationErrors.description}</div>}
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel>Price</FormLabel>
            <FormControl
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              className="common-input"
            />
            {validationErrors.price && <div className="error-text">{validationErrors.price}</div>}
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel>Discount</FormLabel>
            <FormControl
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              step="0.01"
              className="common-input"
            />
            {validationErrors.discount && <div className="error-text">{validationErrors.discount}</div>}
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel>Stock</FormLabel>
            <FormControl
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="common-input"
            />
            {validationErrors.stock && <div className="error-text">{validationErrors.stock}</div>}
          </FormGroup>

          <Button type="submit" className="btn btn-primary">Update Product</Button>
        </Form>
      </div>
    </div>
  );
};

export default ProductUpdateForm;
