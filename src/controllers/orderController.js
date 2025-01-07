const db = require("../models/index");
const Order = db.order;
const Product = db.products;

exports.addOrder = async (req, res) => {
    try {
        const { products, totalPrice, status, userId } = req.body;
        for (const product of products) {
            const currentProduct = await Product.findById(product.productId)
            if (currentProduct?.quantity < product.quantity) {
                throw res.status(404).json({
                    status: "ERR",
                    message: "No product found or quantity not valid",
                });
            }
            currentProduct.quantity = currentProduct.quantity - product.quantity;
            await currentProduct.save()
        }
        if (!products || !totalPrice) {
            return res.status(400).json({
                status: "ERR",
                message: "Products and totalPrice are required",
            });
        }

        const newOrder = await Order.create({ products, totalPrice, status, userId });
        res.status(200).json({
            status: "OK",
            message: "Order created successfully!",
            data: newOrder,
        });
    } catch (error) {
        res.status(500).json({
            message: "AddOrder failed",
            error: error.message,
        });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const { products, totalPrice, status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                products: products || undefined,
                totalPrice: totalPrice || undefined,
                status: status || undefined,
            },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                status: "ERR",
                message: "Order not found",
            });
        }

        res.status(200).json({
            status: "OK",
            message: "Order updated successfully",
            data: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({
            message: "UpdateOrder failed",
            error: error.message,
        });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return res.status(404).json({
                status: "ERR",
                message: "Order not found",
            });
        }

        res.status(200).json({
            status: "OK",
            message: "Order deleted successfully",
            data: deletedOrder,
        });
    } catch (error) {
        res.status(500).json({
            message: "DeleteOrder failed",
            error: error.message,
        });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("products.productId");

        if (!order) {
            return res.status(404).json({
                status: "ERR",
                message: "Order not found",
            });
        }

        res.status(200).json({
            status: "OK",
            message: "Order retrieved successfully",
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            message: "GetOrder failed",
            error: error.message,
        });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("products.productId").populate("userId");

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                status: "ERR",
                message: "No orders found",
            });
        }

        res.status(200).json({
            status: "OK",
            message: "Orders retrieved successfully",
            data: orders,
        });
    } catch (error) {
        res.status(500).json({
            message: "GetAllOrders failed",
            error: error.message,
        });
    }
};