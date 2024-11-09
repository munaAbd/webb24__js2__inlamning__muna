import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/Product';  // Assuming you have a ProductList or similar component
import Cart from './components/Cart';

function App() {
  // State for the cart
  const [cart, setCart] = useState([]);

  // Function to add product to cart and track original inventory
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(p => p.id === product.id);

      if (existingProduct) {
        return prevCart.map(p =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        // Save the original inventory when adding to the cart
        return [...prevCart, { ...product, quantity: 1, originalInventory: product.inventory }];
      }
    });
  };

  const cartCount = cart.reduce((total, product) => total + product.quantity, 0);

  return (
    <Router>
      <Navbar cartCount={cartCount} />
      <Routes>
        <Route path="/" element={<ProductList addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
      </Routes>
    </Router>
  );
}

export default App;