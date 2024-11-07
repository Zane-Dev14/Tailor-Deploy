import React, { useState, useEffect } from 'react';
import { getOrders, createOrder, updateOrder, deleteOrder, getCustomers } from '../api/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    date: '',
    customerName: '',
    lineItems: [{ description: '', estimateAmount: '' }],
    deliveryDate: '',
    remarks: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        setOrders(res);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const fetchCustomers = async () => {
      try {
        const res = await getCustomers();
        setCustomers(res);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchOrders();
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLineItemChange = (index, e) => {
    const { name, value } = e.target;
    const newLineItems = form.lineItems.map((item, i) => (i === index ? { ...item, [name]: value } : item));
    setForm({ ...form, lineItems: newLineItems });
  };

  const addLineItem = () => {
    setForm({ ...form, lineItems: [...form.lineItems, { description: '', estimateAmount: '' }] });
  };

  const removeLineItem = (index) => {
    const newLineItems = form.lineItems.filter((_, i) => i !== index);
    setForm({ ...form, lineItems: newLineItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedName = form.customerName
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const customerExists = customers.some(customer => customer.name === formattedName);

      if (!customerExists) {
        alert('Customer does not exist');
        return;
      }

      const orderData = { ...form, customerName: formattedName };
      if (editMode) {
        await updateOrder(currentId, orderData);
        setEditMode(false);
        setCurrentId(null);
      } else {
        await createOrder(orderData);
      }

      setForm({
        date: '',
        customerName: '',
        lineItems: [{ description: '', estimateAmount: '' }],
        deliveryDate: '',
        remarks: ''
      });

      const res = await getOrders();
      setOrders(res);
    } catch (error) {
      console.error(`Error ${editMode ? 'updating' : 'adding'} order:`, error);
    }
  };

  const handleEdit = (order) => {
    setEditMode(true);
    setCurrentId(order._id);
    setForm({
      date: order.date,
      customerName: order.customerName,
      lineItems: order.lineItems,
      deliveryDate: order.deliveryDate,
      remarks: order.remarks
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      const res = await getOrders();
      setOrders(res);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-8" style={{ backgroundImage: "url('https://www.huntsmansavilerow.com/cdn/shop/files/Kingsman_Orange_Dinner_Jacket.jpg?v=1672752439&width=1500')" }}>
        <div className="bg-white shadow-lg rounded-lg max-w-4xl w-full p-8 bg-opacity-90 backdrop-blur-lg border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Orders</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Date</label>
                    <input 
                        type="date" 
                        name="date" 
                        value={form.date} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900" 
                        required 
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Customer Name</label>
                    <select 
                        name="customerName" 
                        value={form.customerName} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900" 
                        required
                    >
                        <option value="">Select Customer</option>
                        {customers.map(customer => (
                            <option key={customer._id} value={customer.name}>{customer.name}</option>
                        ))}
                    </select>
                </div>
                {form.lineItems.map((item, index) => (
                    <div key={index} className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Line Item {index + 1}</label>
                        <input 
                            type="text" 
                            name="description" 
                            placeholder="Description" 
                            value={item.description} 
                            onChange={(e) => handleLineItemChange(index, e)} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900" 
                            required 
                        />
                        <input 
                            type="number" 
                            name="estimateAmount" 
                            placeholder="Estimate Amount" 
                            value={item.estimateAmount} 
                            onChange={(e) => handleLineItemChange(index, e)} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900 mt-2" 
                            required 
                        />
                        {form.lineItems.length > 1 && (
                            <button 
                                type="button" 
                                onClick={() => removeLineItem(index)} 
                                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 shadow-md"
                            >
                                Remove Line Item
                            </button>
                        )}
                    </div>
                ))}
                <button 
                    type="button" 
                    onClick={addLineItem} 
                    className="w-full md:w-auto mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 shadow-md"
                >
                    Add Line Item
                </button>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Delivery Date</label>
                    <input 
                        type="date" 
                        name="deliveryDate" 
                        value={form.deliveryDate} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900" 
                        required 
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Remarks</label>
                    <textarea 
                        name="remarks" 
                        value={form.remarks} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900" 
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full py-3 rounded-lg font-bold text-white bg-green-500 hover:bg-green-600 transition duration-200 shadow-md"
                >
                    {editMode ? 'Update Order' : 'Create Order'}
                </button>
            </form>
            <div className="mt-8 bg-white rounded-lg shadow-lg border border-gray-300">
    <h2 className="text-xl font-bold mb-4 px-4 pt-4">Existing Orders</h2>
    <div className="max-h-96 overflow-y-scroll overflow-x-scroll"> {/* Enable both vertical and horizontal scrolling */}
        <table className="min-w-full bg-white text-gray-900">
            <thead>
                <tr className="bg-gray-900 text-white">
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Customer #</th>
                    <th className="py-3 px-4 text-left">Customer Name</th>
                    <th className="py-3 px-4 text-left">Order #</th>
                    <th className="py-3 px-4 text-left">Line Item</th>
                    <th className="py-3 px-4 text-left">Description</th>
                    <th className="py-3 px-4 text-left">Delivery Date</th>
                    <th className="py-3 px-4 text-left">Estimate Amount</th>
                    <th className="py-3 px-4 text-left">Remarks</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                {orders.map(order => (
                    order.lineItems.map(item => (
                        <tr key={`${order._id}-${item.lineItem}`} className="even:bg-gray-100 odd:bg-white hover:bg-gray-200 transition duration-200">
                            <td className="py-3 px-4 border-t border-gray-300">{new Date(order.date).toLocaleDateString('en-GB')}</td>
                            <td className="py-3 px-4 border-t border-gray-300">{order.customerId}</td>
                            <td className="py-3 px-4 border-t border-gray-300">{order.customerName}</td>
                            <td className="py-3 px-4 border-t border-gray-300">{order.orderId}</td>
                            <td className="py-3 px-4 border-t border-gray-300">{item.lineItem}</td>
                            <td className="py-3 px-4 border-t border-gray-300">{item.description}</td>
                            <td className="py-3 px-4 border-t border-gray-300">{new Date(order.deliveryDate).toLocaleDateString('en-GB')}</td>
                            <td className="py-3 px-4 border-t border-gray-300">{item.estimateAmount}</td>
                            <td className="py-3 px-4 border-t border-gray-300">{order.remarks}</td>
                            <td className="py-3 px-4 border-t border-gray-300 flex space-x-2">
                                <button 
                                    type="button" 
                                    onClick={() => handleEdit(order)} 
                                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 shadow-md"
                                >
                                    Edit
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => handleDelete(order._id)} 
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 shadow-md"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ))}
            </tbody>
        </table>
    </div>
</div>

        </div>
    </div>
);
  
};

export default Orders;
