const db = require("../models/index");

const Customer = db.customer;

exports.addCustomer = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        if (!name || !email || !phone || !address) {
            return res.status(400).json({ status: "ERR", message: "All fields are required" });
        }

        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ status: "ERR", message: "Customer already exists" });
        }

        const newCustomer = await Customer.create({ name, email, phone, address });
        res.status(200).json({ status: "OK", message: "Customer added successfully", data: newCustomer });
    } catch (error) {
        res.status(500).json({ status: "ERR", message: "Failed to add customer", error: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const { name, email, phone, address, isActive } = req.body;

        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, address, isActive },
            { new: true, runValidators: true }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ status: "ERR", message: "Customer not found" });
        }

        res.status(200).json({ status: "OK", message: "Customer updated successfully", data: updatedCustomer });
    } catch (error) {
        res.status(500).json({ status: "ERR", message: "Failed to update customer", error: error.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

        if (!deletedCustomer) {
            return res.status(404).json({ status: "ERR", message: "Customer not found" });
        }

        res.status(200).json({ status: "OK", message: "Customer deleted successfully", data: deletedCustomer });
    } catch (error) {
        res.status(500).json({ status: "ERR", message: "Failed to delete customer", error: error.message });
    }
};

exports.getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ status: "ERR", message: "Customer not found" });
        }

        res.status(200).json({ status: "OK", message: "Customer fetched successfully", data: customer });
    } catch (error) {
        res.status(500).json({ status: "ERR", message: "Failed to fetch customer", error: error.message });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();

        if (!customers.length) {
            return res.status(404).json({ status: "ERR", message: "No customers found" });
        }

        res.status(200).json({ status: "OK", message: "Customers fetched successfully", data: customers });
    } catch (error) {
        res.status(500).json({ status: "ERR", message: "Failed to fetch customers", error: error.message });
    }
};
