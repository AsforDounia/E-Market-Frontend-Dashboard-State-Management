import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Login from '../Login';
import { login } from '../../store/authSlice';

// Mock the login action
jest.mock('../../store/authSlice', () => ({
    login: jest.fn(() => ({ type: 'auth/login/pending' })),
}));

const mockStore = configureStore([]);

describe('Login Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: {
                loading: false,
                error: null,
                isAuthenticated: false,
            },
        });
        store.dispatch = jest.fn();
    });

    const renderLogin = () => {
        return render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );
    };

    it('renders login form correctly', () => {
        renderLogin();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    });

    it.skip('shows validation errors for empty fields', async () => {
        renderLogin();

        fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

        await waitFor(() => {
            expect(screen.getByText(/email requis/i)).toBeInTheDocument();
            expect(screen.getByText(/mot de passe requis/i)).toBeInTheDocument();
        });
    });

    it('shows validation error for invalid email', async () => {
        renderLogin();

        const emailInput = screen.getByLabelText(/email/i);
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.blur(emailInput);

        await waitFor(() => {
            expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
        });
    });

    it('dispatches login action with valid data', async () => {
        renderLogin();

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
        });
    });
});
