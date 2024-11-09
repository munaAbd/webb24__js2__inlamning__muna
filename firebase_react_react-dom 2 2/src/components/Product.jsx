import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Firebase setup
import { ref, onValue, update } from 'firebase/database'; // Firebase functions

function Product({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Firebase when the component mounts
  useEffect(() => {
    const productsRef = ref(db, 'products');
    
    // Listen to real-time updates in Firebase
    const unsubscribe = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const productData = snapshot.val();
        // Map product data from Firebase to the state
        setProducts(Object.entries(productData).map(([id, value]) => ({ id, ...value })));
        setLoading(false);
      } else {
        console.log('Inga produkter hittades.');
        setLoading(false);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Handle adding a product to the cart
  const handleAddToCart = async (product) => {
    if (product.inventory > 0) {
      // Save the original inventory when adding to cart
      const newInventory = product.inventory - 1;
      const productRef = ref(db, `products/${product.id}`);

      try {
        // Update inventory in Firebase
        await update(productRef, { inventory: newInventory });

        // Only update local state if Firebase update is successful
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === product.id ? { ...p, inventory: newInventory } : p
          )
        );

        // Add the product to the cart and include the original inventory for later use
        addToCart({ ...product, quantity: 1, originalInventory: product.inventory });
      } catch (error) {
        console.error('Error updating inventory:', error);
        alert('Could not update product, try again later.');
      }
    } else {
      alert('Produkt är slut i lager!');
    }
  };

  // Show loading indicator while fetching products
  if (loading) return <p>Laddar produkter...</p>;

  return (
    <div>
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <h2>{product.name} - {product.price} kr</h2>
              <p>Lagersaldo: {product.inventory > 0 ? product.inventory : 'Slut i lager'}</p>
              <button 
                onClick={() => handleAddToCart(product)} 
                disabled={product.inventory === 0}
              >
                Köp nu
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Inga produkter tillgängliga just nu.</p>
      )}
    </div>
  );
}

export default Product;