import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import CartSidebar from '../CartSidebar';
import { updateQuantity, removeFromCart } from '../../../store/cartSlice';

jest.mock('../../../utils/env');

// Mock actions
jest.mock('../../../store/cartSlice', () => ({
  updateQuantity: jest.fn(() => ({ type: 'cart/updateQuantity' })),
  removeFromCart: jest.fn(() => ({ type: 'cart/removeFromCart' })),
  applyCoupon: jest.fn(() => ({ type: 'coupon/apply' })),
  removeCoupon: jest.fn(() => ({ type: 'coupon/remove' })),
}));

const mockStore = configureStore([]);

describe('CartSidebar Component', () => {
  let store;

  const renderCartSidebar = (initialState) => {
    store = mockStore(initialState);
    store.dispatch = jest.fn();
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <CartSidebar />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders empty cart message', () => {
    renderCartSidebar({
      cart: { items: [], totalAmount: 0 },
      coupon: { appliedCoupon: null, loading: false, error: null }
    });

    const trigger = screen.getByRole('button', { name: /panier/i });
    fireEvent.click(trigger);

    expect(screen.getByText(/votre panier est vide/i)).toBeInTheDocument();
  });

  it('renders cart items correctly', () => {
    const items = [
      { _id: '1', title: 'Test Product', price: 100, quantity: 2, imageUrls: [{ imageUrl: 'test.jpg' }] }
    ];

    renderCartSidebar({
      cart: { items, totalAmount: 200 },
      coupon: { appliedCoupon: null, loading: false, error: null }
    });

    const trigger = screen.getByRole('button', { name: /panier/i });
    fireEvent.click(trigger);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getAllByText('200.00 €')[0]).toBeInTheDocument();
  });
});
