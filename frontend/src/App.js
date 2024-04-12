import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from '../src/components/Login';
import AllProduct from '../src/components/AllProduct';
import AddProduct from '../src/components/AddProduct';
import Search from './components/Search';
import AddCategory from './components/AddCategory';
import EditProduct from './components/EditProduct';
import RegisterUser from './components/RegisterUser';
import "bootstrap/dist/css/bootstrap.min.css";
import { UserContextProvider } from "./Context/UserContext";
import Profile from './components/Profile';


function App() {
  return (
    <UserContextProvider>
      
   
    <Routes>
      <Route path="/" element={<RegisterUser />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/AllProducts" element={<AllProduct />} />
      <Route path="/addProduct" element={<AddProduct />} />
      <Route path="/search" element={<Search />} />
      <Route path="/addCategory" element={<AddCategory />} />
      <Route path="/editProduct/:id" element={<EditProduct />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
   
    </UserContextProvider>
  );
}

export default App; 