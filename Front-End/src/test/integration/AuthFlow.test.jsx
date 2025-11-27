import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Login from '../../pages/Login';
import Home from '../../pages/Home';
import { login } from '../../store/authSlice';

jest.mock('../../utils/env');

// Mock the auth service
jest.mock('../../services/authService', () => ({
    login: jest.fn(() => Promise.resolve({
        data: {
            user: { id: 1, name: 'Test User' },
            token: 'fake-token'
        }
    })),
}));

// Create a store with thunk middleware
const middlewares = [thunk]; // Note: redux-mock-store doesn't support thunks by default without middleware, 
// but since we are mocking the slice action in unit tests, here we might want to use the real store or a better mock.
// For integration tests, using the REAL store is better.

import { configureStore as createRealStore } from '@reduxjs/toolkit';
import authReducer from '../../store/authSlice';

const createTestStore = () => {
    return createRealStore({
        reducer: {
            auth: authReducer,
        },
    });
};

describe('Auth Flow Integration', () => {
    it('redirects to home after successful login', async () => {
        const store = createTestStore();

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/login']}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<div>Home Page</div>} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

        // Wait for redirection
        await waitFor(() => {
            expect(screen.getByText('Home Page')).toBeInTheDocument();
        });
    });
});
