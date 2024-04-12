import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './component.css';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState([])

    const handleSearch = (event) => {
        navigate("/search");
    };

    const navigate = useNavigate();

    const handleNextPage = () => {
        setPage(page + 1);
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };


    const handleLogout = () => {
        console.log('jkdskj');
        localStorage.removeItem('accessToken');
        navigate('/Login')
    }

    const handleClick = () => {
        navigate('/addProduct');
    }

    const handleImageClick = () => {

    }

    const handleDelete = (id) => {
        console.log(id);
        const token = localStorage.getItem('accessToken');
                if (!token) {
                    console.log('No token found. User is not authenticated.');
                    navigate("/")
                }

        const isConfirmed = window.confirm('Are you sure you want to delete this product?');

        if (!isConfirmed) {
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:5000/api/deleteProducts/${id}`, true);
        xhr.setRequestHeader('Authorization', token);
       
        xhr.onload = function () {
            if (xhr.status === 200) {
                setErrorMessage('Product deleted successfully');
                console.log('product deleted successfully');
                window.location.reload()
            } else {
                setErrorMessage("Failed to delete product. As you have products/category.");
                console.error('Failed to delete product. Status:', xhr.status);
                window.location.reload()
            }
        }; 
        xhr.onerror = function () {
            console.error('Error deleting product. Network error');
        };
        xhr.send();
    }

    useEffect(() => {
        const fetchProducts = async () => {
            try {

                const token = localStorage.getItem('accessToken');
                if (!token) {
                    console.log('No token found. User is not authenticated.');
                    navigate("/")
                }
                const xhr = new XMLHttpRequest();
                xhr.open('GET', 'http://localhost:5000/api/products', true);
                xhr.setRequestHeader('Authorization', token);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            const response = JSON.parse(xhr.responseText);
                            setProducts(response);
                        } else {
                            console.error('Error fetching products:', xhr.statusText);
                        }
                    }
                };
                xhr.send();
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    console.log('No token found. User is not authenticated.');
                    return;
                }

                const headers = {
                    'Authorization': token
                };

                const response = await axios.get(`http://localhost:5000/api/users/profile/1`, { headers });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();

        fetchProducts();
    }, []);

    return (
        <div className="container-fluid bg-dark text-light">
    <nav className="navbar navbar-expand-lg navbar-light bg-dark mt-5 mb-3">
        <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <h2 className="text-light">Product list</h2>
            </div>
            <div className="d-flex align-items-center">
                <div className="dropdown">
                    <button className="btn btn-primary btn-sm mx-5" type="button" onClick={handleSearch}>Search</button>
                    <button className="btn btn-warning btn-sm mx-5" type="button" onClick={handleLogout}>Log Out</button>
                    <a className="navbar-brand mt-2 mt-lg-0" href='' onClick={handleImageClick}>
                        <img
                             src={`http://localhost:5000/assets/${user.profilePic}`}
                             height="30"
                             width="30"
                            alt="user"
                        />
                    </a>
                </div>
            </div>
        </div>
    </nav>
    <table className="table table-dark">
        <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Category ID</th>
                <th>Price</th>
                <th>Images</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
        </thead>
        <tbody>
            {products.map((product, index) => (
                <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.categoryId}</td>
                    <td>{product.price}</td>
                    <td>
                        {Array.isArray(product.images) && product.images.map((image, i) => (
                            <img key={i} src={image} alt={`Product ${i}`} style={{ maxWidth: '100px' }} />
                        ))}
                    </td>
                    <td>{<button className="btn btn-primary btn-sm" onClick={() => navigate(`/editProduct/${product.productId}`)}>Edit</button>}</td>
                    <td>{<button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.id)}>Delete</button>}</td>
                </tr>
            ))}
        </tbody>
    </table>
    <button className="btn btn-primary btn-sm" type="button" onClick={handleClick}>Add Product</button>
    <button className="btn btn-primary btn-sm mx-5" type="button" onClick={handlePreviousPage} disabled={page === 1}>Previous Page</button>
    <span className="mx-2">Page {page}</span>
    <button className="btn btn-primary btn-sm mx-5" type="button" onClick={handleNextPage} disabled={products.length < pageSize}>Next Page</button>
</div>

    );
};

export default ProductTable;
