import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'cartItems';

function loadInitialCart() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const item = action.payload;
      const existing = state.find((cartItem) => cartItem._id === item._id);

      if (existing) {
        return state.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, qty: cartItem.qty + (item.qty || 1) }
            : cartItem
        );
      }

      return [...state, { ...item, qty: item.qty || 1 }];
    }

    case 'REMOVE_FROM_CART':
      return state.filter((cartItem) => cartItem._id !== action.payload);

    case 'UPDATE_QUANTITY':
      return state
        .map((cartItem) =>
          cartItem._id === action.payload._id
            ? { ...cartItem, qty: Math.max(1, action.payload.qty) }
            : cartItem
        )
        .filter((cartItem) => cartItem.qty > 0);

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cartItems, dispatch] = useReducer(cartReducer, [], loadInitialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const itemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.qty, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + Number(item.price) * item.qty, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      cartTotal,
      itemCount,
      dispatch,
      isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      toggleCart: () => setIsCartOpen((prev) => !prev),
    }),
    [cartItems, cartTotal, itemCount, isCartOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
