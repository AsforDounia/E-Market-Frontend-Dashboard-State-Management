import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../../store/cartSlice';
import ordersReducer from '../../store/ordersSlice';
import couponReducer from '../../store/couponSlice';
import Checkout from '../../pages/Checkout';

jest.mock('../../utils/env');

// Mock api
jest.mock('../../services/api', () => ({
    post: jest.fn((url) => {
        if (url === '/orders') {
            return Promise.resolve({ data: { orderId: '123', status: 'pending' } });
        }
        return Promise.resolve({ data: {} });
    }),
    get: jest.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
    },
    create: jest.fn(() => ({
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() },
        },
    })),
}));

const createTestStore = (preloadedState) => {
    return configureStore({
        reducer: {
            cart: cartReducer,
            orders: ordersReducer,
            coupon: couponReducer,
        },
        preloadedState,
    });
};

describe('Checkout Flow Integration', () => {
    it('allows user to place an order', async () => {
        const initialState = {
            cart: {
                items: [{ _id: '1', title: 'Product 1', price: 100, quantity: 1, totalPrice: 100 }],
                totalQuantity: 1,
                totalAmount: 100,
            },
            orders: { loading: false, error: null, currentOrder: null },
            coupon: { appliedCoupon: null, loading: false, error: null },
        };

        const store = createTestStore(initialState);

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Checkout />
                </MemoryRouter>
            </Provider>
        );

        // Check if cart items are reflected in total
        expect(screen.getAllByText('100.00 €')[0]).toBeInTheDocument();

        // Fill shipping info
        fireEvent.change(screen.getByLabelText(/nom complet/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/adresse/i), { target: { value: '123 Main St' } });
        fireEvent.change(screen.getByLabelText(/ville/i), { target: { value: 'Paris' } });
        fireEvent.change(screen.getByLabelText(/code postal/i), { target: { value: '75001' } });

        // Click checkout
        fireEvent.click(screen.getByRole('button', { name: /passer la commande/i }));

        // Verify order creation (button changes text or success message)
        await waitFor(() => {
            // Since we mock the service but not the slice fully, we rely on state updates.
            // The component shows "Payer maintenant" if order is created (status pending)
            expect(screen.getByRole('button', { name: /payer maintenant/i })).toBeInTheDocument();
        });
    });
});
