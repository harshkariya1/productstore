import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './component.css';

const ProductForm = ({ onSubmit }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryId: '',
        price: '',
        images: null
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, images: e.target.files[0] });
    };

    const handleShowAllProducts = () => {
        navigate('/allProducts');
    }

    const handleCancel = () => {
        navigate('/allProducts');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.description || !formData.categoryId || !formData.price || !formData.images) {
            setErrorMessage('All fields are required!');
            return;
        }
        const { name, description, categoryId, price, images } = formData;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:5000/api/createProducts', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log('Product created successfully');

                } else {
                    console.error('Error creating product:', xhr.responseText);

                }
            }
        };
        xhr.send(
            JSON.stringify({
                name,
                description,
                categoryId,
                price,
                images: images.name
            })
        );
        navigate('/allProducts');
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-dark">
            <div className="login-form p-5 rounded shadow bg-dark" style={{ width: '400px', border: 'none' }}>
                <h3 className="text-center mb-4 text-light">Add Product</h3>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Form onSubmit={handleSubmit} className="bg-transparent">
                    <Form.Group controlId="formName" className="mb-3">
                        <Form.Label className="text-light">Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter product name"
                            value={formData.name}
                            onChange={handleChange}
                            className="rounded-pill"
                            name="name"
                        />
                    </Form.Group>

                    <Form.Group controlId="formDescription" className="mb-3">
                        <Form.Label className="text-light">Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter product description"
                            value={formData.description}
                            onChange={handleChange}
                            className="rounded-pill"
                            name="description"
                        />
                    </Form.Group>

                    <Form.Group controlId="formCategoryId" className="mb-3">
                        <Form.Label className="text-light">Category ID</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter category ID"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="rounded-pill"
                            name="categoryId"
                        />
                    </Form.Group>

                    <Form.Group controlId="formPrice" className="mb-3">
                        <Form.Label className="text-light">Price</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter product price"
                            value={formData.price}
                            onChange={handleChange}
                            className="rounded-pill"
                            name="price"
                        />
                    </Form.Group>

                    <Form.Group controlId="formImages" className="mb-3">
                        <Form.Label className="text-light">Images</Form.Label>
                        <div className="custom-file">
                            <Form.Control
                                type="file"
                                className="custom-file-input"
                                onChange={handleFileChange}
                                name="images"
                            />
                            <label className="custom-file-label text-light" htmlFor="formImages">
                                Choose file
                            </label>
                        </div>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 rounded-pill mb-3">
                        Submit
                    </Button>

                    <Button variant="outline-primary" className="w-100 rounded-pill" onClick={handleShowAllProducts}>
                        Show All Products
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default ProductForm;
