import { useState, useReducer, createContext} from 'react';
import { DUMMY_PRODUCTS } from '../dummy-products.js';

export const CartContext = createContext({
    items:[],
    addItemToCart: () => {},
    updateCartItemQuantity: () => {}
});

function shoppingCartReducer (state, action) {

  if(action.type === 'ADD_ITEMS'){
    const updatedItems = [...state.items];
    
    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload
    );
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
      updatedItems.push({
        id: action.payload,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }

    return {
      ...state,
      items: updatedItems,
    };
  }

  if(action.type === 'UPDATE_ITEMS') {
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId
    );

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    updatedItem.quantity += action.payload.amount;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return {
      ...state,
      items: updatedItems,
    };
  }
}

export default function CartContextProvider ({children}) {  
    const [shoppingCartState, dispatchShoppingCartState] = useReducer(shoppingCartReducer, {
      items: [],
    });

      function handleAddItemToCart(id) {
        dispatchShoppingCartState({
          type: 'ADD_ITEMS',
          payload: id
        });
      }
    
      function handleUpdateCartItemQuantity(productId, amount) {
        dispatchShoppingCartState({
          type: 'UPDATE_ITEMS',
          payload: {
            productId,
            amount
          }
        });
      }
    
      const contextValue = {
        items: shoppingCartState.items,
        addItemToCart: handleAddItemToCart,
        updateCartItemQuantity: handleUpdateCartItemQuantity,
      }

      return <CartContext.Provider value={contextValue}>
        {children}
      </CartContext.Provider>
}
