import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    images: null
  });
  const [errorMessage, setErrorMessage] = useState('');
  const token = localStorage.getItem('accessToken');
  let response; 



  useEffect(() => {
    const fetchProductData = async () => {

      try {

        if (!token) {
          console.log('No token found. User is not authenticated.');
          navigate('/');
          return;
        }
        console.log("Edit Product")
        const response = await fetch(`http://localhost:5000/api/productById/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          
        });
        
        if (response.status === 200) {
          const data = await response.json();
          setProduct(data);
          console.log(data);
        } else if (response.status === 401) {
          console.log('Unauthorized access. Token may be invalid or expired.');
          navigate('/');
        } else {
          console.log('Error fetching product data. Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleShowAllBook = () => {
    navigate('/AllProducts');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if( !product.productId||!product.name || !product.description || !product.categoryId || !product.price || !product.images ) {
      setErrorMessage('All fields are required!');
      console.log("frontend");
      return;
    }
    try {
       response = await fetch(`http://localhost:5000/api/updateProduct/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': ` bearer ${token}`,
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify(response),
      });
      if (response.ok) {
        console.log('Product updated successfully');
        navigate('/AllProducts');
      } else {
        console.error('Failed to update product:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="bg-dark text-light py-5">
      <div className="container mt-5">
        <h2 className="mb-4">Update Product</h2>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="id" className="form-label">product ID</label>
            <input
              type="text"
              className="form-control bg-dark text-light"
              id="id"
              name="id"
              value={product.productId }
              onChange={handleChange}
              
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control bg-dark text-light"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input
              type="text"
              className="form-control bg-dark text-light"
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="categoryId" className="form-label">Category ID</label>
            <input
              type="text"
              className="form-control bg-dark text-light"
              id="categoryId"
              name="categoryId"
              value={product.categoryId}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">product price</label>
            <input
              type="text"
              className="form-control bg-dark text-light"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="images" className="form-label">images</label>
            <input
              type="file"
              className="form-control bg-dark text-light"
              id="images"
              name="images"
              value={product.images}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary mr-3" >Update Product</button>
          <button type="button" className="btn btn-primary m-4" onClick={handleShowAllBook}>Show All Books</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBook;