import cartReducer, { addToCart, removeFromCart, updateQuantity, clearCart } from '../cartSlice';

describe('cartSlice', () => {
    const initialState = {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
    };

    beforeEach(() => {
        localStorage.clear();
    });

    it('should handle initial state', () => {
        expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should add a new item to cart', () => {
        const product = { _id: '1', title: 'Product 1', price: 100 };
        const action = addToCart({ product, quantity: 1 });
        const state = cartReducer(initialState, action);

        expect(state.items).toHaveLength(1);
        expect(state.items[0]).toEqual({ ...product, quantity: 1, totalPrice: 100 });
        expect(state.totalQuantity).toBe(1);
        expect(state.totalAmount).toBe(100);
    });

    it('should update quantity if item already exists', () => {
        const product = { _id: '1', title: 'Product 1', price: 100 };
        const stateWithItem = {
            items: [{ ...product, quantity: 1, totalPrice: 100 }],
            totalQuantity: 1,
            totalAmount: 100
        };

        const action = addToCart({ product, quantity: 2 });
        const state = cartReducer(stateWithItem, action);

        expect(state.items).toHaveLength(1);
        expect(state.items[0].quantity).toBe(3);
        expect(state.items[0].totalPrice).toBe(300);
        expect(state.totalQuantity).toBe(3);
        expect(state.totalAmount).toBe(300);
    });

    it('should remove item from cart', () => {
        const product = { _id: '1', title: 'Product 1', price: 100 };
        const stateWithItem = {
            items: [{ ...product, quantity: 1, totalPrice: 100 }],
            totalQuantity: 1,
            totalAmount: 100
        };

        const action = removeFromCart('1');
        const state = cartReducer(stateWithItem, action);

        expect(state.items).toHaveLength(0);
        expect(state.totalQuantity).toBe(0);
        expect(state.totalAmount).toBe(0);
    });

    it('should update item quantity', () => {
        const product = { _id: '1', title: 'Product 1', price: 100 };
        const stateWithItem = {
            items: [{ ...product, quantity: 1, totalPrice: 100 }],
            totalQuantity: 1,
            totalAmount: 100
        };

        const action = updateQuantity({ id: '1', quantity: 5 });
        const state = cartReducer(stateWithItem, action);

        expect(state.items[0].quantity).toBe(5);
        expect(state.items[0].totalPrice).toBe(500);
        expect(state.totalQuantity).toBe(5);
        expect(state.totalAmount).toBe(500);
    });

    it('should clear cart', () => {
        const stateWithItems = {
            items: [{ _id: '1', price: 100, quantity: 1, totalPrice: 100 }],
            totalQuantity: 1,
            totalAmount: 100
        };

        const action = clearCart();
        const state = cartReducer(stateWithItems, action);

        expect(state.items).toHaveLength(0);
        expect(state.totalQuantity).toBe(0);
        expect(state.totalAmount).toBe(0);
    });
});
