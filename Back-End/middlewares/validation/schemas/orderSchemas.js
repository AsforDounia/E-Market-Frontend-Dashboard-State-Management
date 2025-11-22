import { Yup } from "../yupExtensions.js";

const createOrderSchema = Yup.object().shape({
    couponCodes: Yup.array().of(Yup.string()).optional(),
    cartItems: Yup.array()
        .of(
            Yup.object().shape({
                productId: Yup.string().required(),
                quantity: Yup.number().positive().integer().required(),
            })
        )
        .min(1, "Cart cannot be empty").required("Cart items are required"),
    shippingInfo: Yup.object().shape({
        name: Yup.string().required("Name is required"),
        address: Yup.string().required("Address is required"),
        city: Yup.string().required("City is required"),
        postalCode: Yup.string().required("Postal code is required"),
    }).required("Shipping information is required"),
});

const updateOrderStatusSchema = Yup.object().shape({
    status: Yup.string()
        .requiredField("Status")
        .enumField(["pending", "paid", "shipped", "delivered"], "Status"),
});

export { createOrderSchema, updateOrderStatusSchema };
