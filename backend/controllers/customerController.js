const Customer = require('../models/Customer');

exports.createOrUpdateCustomer = async (req, res) => {
    try {
        const { name, mobile, place, remarks } = req.body;
        const formattedName = name
            .toLowerCase()  
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        let customer = await Customer.findOne({ name: formattedName });

        if (customer) {
            return res.status(400).json({ message: 'Customer already exists. Please edit the existing customer.' });
        } else {
            const lastCustomer = await Customer.findOne().sort({ customerId: -1 });
            const newCustomerId = lastCustomer ? lastCustomer.customerId + 1 : 1;
            customer = new Customer({
                customerId: newCustomerId,
                name: formattedName,
                mobile,
                place,
                remarks
            });

            await customer.save();
            res.status(201).json(customer);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json({ message: 'Customer deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};