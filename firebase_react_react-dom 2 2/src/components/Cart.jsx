import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, update } from 'firebase/database';
import { db } from '../firebase';

function Cart({ cart = [], setCart }) {
  const [isClearing, setIsClearing] = useState(false);
  const navigate = useNavigate();

  // Calculate total cost of items in the cart
  const calculateTotal = () => {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  // Handle checkout (update inventory in Firebase)
  const handleCheckout = async () => {
    alert('Tack för att du handlade hos oss!');
    
    // Decrement inventory only when checking out
    try {
      console.log('Proceeding to checkout...');
      const updatePromises = cart.map(async (product) => {
        const productRef = ref(db, `products/${product.id}`);
        const updatedInventory = product.inventory - product.quantity; // Decrement inventory

        try {
          // Update inventory in Firebase
          await update(productRef, { inventory: updatedInventory });
          console.log(`Lagersaldo för ${product.name} minskat till ${updatedInventory}.`);
        } catch (error) {
          console.error(`Fel vid uppdatering av ${product.name}:`, error);
          throw new Error(`Misslyckades med att uppdatera ${product.name}`);
        }
      });

      // Wait for all inventory updates to complete
      await Promise.all(updatePromises);

      // Clear cart after successful checkout
      setCart([]); 
      navigate('/'); // Redirect to home after checkout
    } catch (error) {
      alert('Ett fel inträffade vid uppdatering av lagersaldo. Försök igen senare.');
      console.error('Fel vid uppdatering av lagersaldo:', error);
    }
  };

  // Handle clear cart (do not update Firebase inventory, restore to original state)
  const handleClearCart = async () => {
    if (isClearing) return; // Prevent clearing multiple times
    setIsClearing(true);

    if (window.confirm('Är du säker på att du vill tömma kundvagnen?')) {
      console.log('Clearing the cart, no Firebase updates here');
      
      // Only clear the cart from the frontend, don't affect Firebase
      const restoreInventoryPromises = cart.map(async (product) => {
        const productRef = ref(db, `products/${product.id}`);
        
        try {
          // Restore original inventory value from the cart
          await update(productRef, { inventory: product.originalInventory });
          console.log(`Restored inventory for ${product.name} to ${product.originalInventory}`);
        } catch (error) {
          console.error(`Failed to restore inventory for ${product.name}:`, error);
        }
      });

      // Wait for all inventory restorations to complete
      await Promise.all(restoreInventoryPromises);

      // Clear cart items in the frontend state
      setCart([]);  
      setIsClearing(false);
    } else {
      setIsClearing(false); // If user cancels, don't clear the cart
    }
  };

  return (
    <div>
      <h2>Varukorg</h2>
      {cart.length > 0 ? (
        <div>
          <h3>Produkter i varukorgen:</h3>
          <ul>
            {cart.map((product) => (
              <li key={product.id}>
                <h4>{product.name} - {product.price} kr</h4>
                <p>Antal: {product.quantity}</p>
              </li>
            ))}
          </ul>

          <h3>Totalpris: {calculateTotal()} kr</h3>
          <button onClick={handleCheckout}>Slutför köp</button>
          <button onClick={handleClearCart} disabled={isClearing}>
            {isClearing ? 'Tömmer...' : 'Töm kundvagnen'}
          </button>
        </div>
      ) : (
        <p>Din varukorg är tom.</p>
      )}
    </div>
  );
}

export default Cart;