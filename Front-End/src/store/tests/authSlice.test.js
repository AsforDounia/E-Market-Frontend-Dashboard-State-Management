import authReducer, { login, logout } from '../authSlice';

jest.mock('../../utils/env');
import * as authService from '../../services/authService';

// Mock the auth service
jest.mock('../../services/authService');

describe('authSlice', () => {
    const initialState = {
        user: null,
        token: null,
        loading: false,
        error: null,
        isAuthenticated: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('should handle initial state', () => {
        expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    describe('login', () => {
        it('should set loading true when login is pending', () => {
            const action = { type: login.pending.type };
            const state = authReducer(initialState, action);
            expect(state.loading).toBe(true);
            expect(state.error).toBe(null);
        });

        it('should update state when login is fulfilled', () => {
            const mockUser = { id: 1, name: 'Test User' };
            const mockToken = 'fake-token';
            const action = {
                type: login.fulfilled.type,
                payload: { user: mockUser, token: mockToken }
            };

            const state = authReducer(initialState, action);

            expect(state.loading).toBe(false);
            expect(state.user).toEqual(mockUser);
            expect(state.token).toBe(mockToken);
            expect(state.isAuthenticated).toBe(true);
        });

        it('should set error when login is rejected', () => {
            const errorMsg = 'Invalid credentials';
            const action = {
                type: login.rejected.type,
                payload: errorMsg
            };

            const state = authReducer(initialState, action);

            expect(state.loading).toBe(false);
            expect(state.error).toBe(errorMsg);
        });
    });

    describe('logout', () => {
        it('should clear state when logout is fulfilled', () => {
            const loggedInState = {
                ...initialState,
                user: { id: 1 },
                token: 'token',
                isAuthenticated: true
            };

            const action = { type: logout.fulfilled.type };
            const state = authReducer(loggedInState, action);

            expect(state.user).toBe(null);
            expect(state.token).toBe(null);
            expect(state.isAuthenticated).toBe(false);
        });
    });
});
