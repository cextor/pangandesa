import React, { createContext, useContext, useState } from 'react';
import { CartItem, Product } from '../types';
import { parseHarvestSchedules } from '../utils/harvestHelper';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, selectedHarvestDate?: string) => void;
  removeFromCart: (productId: string, selectedHarvestDate?: string) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number, selectedHarvestDate?: string) => {
    setCartItems(prev => {
      const existing = prev.find(item => 
        item.id === product.id && item.selectedHarvestDate === selectedHarvestDate
      );
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedHarvestDate === selectedHarvestDate)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // Overwrite the product price/stock in the cart item to match the selected harvest date's price/stock
      let price = product.price;
      let stock = product.stock;
      if (selectedHarvestDate) {
        const schedules = parseHarvestSchedules(product.harvestDate, product.stock, product.price, product.isPreOrder);
        const matched = schedules.find(s => s.date === selectedHarvestDate);
        if (matched) {
          price = matched.price;
          stock = matched.stock;
        }
      }

      return [...prev, { ...product, price, stock, quantity, selectedHarvestDate }];
    });
  };

  const removeFromCart = (productId: string, selectedHarvestDate?: string) => {
    setCartItems(prev => prev.filter(item => 
      !(item.id === productId && item.selectedHarvestDate === selectedHarvestDate)
    ));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
