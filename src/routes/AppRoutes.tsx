import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home';
import { ProductDetail } from '../pages/ProductDetail/ProductDetail';
import Cart from '../pages/Cart/Cart';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
