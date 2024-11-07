const Order = require('../models/Order');
const Customer = require('../models/Customer');

const formatName = (name) => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

exports.createOrder = async (req, res) => {
  try {
    const { customerName, lineItems, ...orderData } = req.body;
    const formattedName = formatName(customerName);
    const customer = await Customer.findOne({ name: formattedName });

    if (!customer) {
      return res.status(400).json({ message: 'Customer does not exist' });
    }

    // Format line items with auto-generated line numbers
    const formattedLineItems = lineItems.map((item, index) => ({
      ...item,
      lineItem: index + 1
    }));

    const order = new Order({
      ...orderData,
      customerId: customer.customerId,
      customerName: formattedName,
      lineItems: formattedLineItems
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, lineItems, ...orderData } = req.body;
    const formattedName = formatName(customerName);
    const customer = await Customer.findOne({ name: formattedName });

    if (!customer) {
      return res.status(400).json({ message: 'Customer does not exist' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, {
      ...orderData,
      customerId: customer.customerId,
      customerName: formattedName,
      lineItems: lineItems.map((item, index) => ({ ...item, lineItem: index + 1 }))
    }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};  

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
  