import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Login from '../src/components/Login';
import AllProduct from '../src/components/AllProduct';
import AddProduct from '../src/components/AddProduct';
import Search from './components/Search';
import AddCategory from './components/AddCategory';
import EditProduct from './components/EditProduct';
import RegisterUser from './components/RegisterUser';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterUser />} />
      <Route path="/Login" element={<Login />} />
      <Route path="" element={<AllProduct />} />
      <Route path="/addProduct" element={<AddProduct />} />
      <Route path="/search" element={<Search />} />
      <Route path="/addCategory" element={<AddCategory />} />
      <Route path="/editProduct/:id" element={<EditProduct />} />
    </Routes>
  );
}

export default App; 