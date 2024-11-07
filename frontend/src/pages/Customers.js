import React, { useState, useEffect } from 'react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../api/api';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({ name: '', mobile: '', place: '', remarks: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await getCustomers();
                setCustomers(res);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };
        fetchCustomers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    const formatName = (name) => {
      return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage('');
      setLoading(true);
    
      const formattedName = formatName(form.name);
    
      try {
        const existingCustomer = customers.find(cust => cust.name === formattedName);
    
        if (existingCustomer) {
          setErrorMessage('Customer already exists. Please edit the existing customer.');
          setLoading(false);
          alert('Customer already exists. Please edit the existing customer.'); // Add alert here
          return; // Prevent further execution
        }
    
        if (editMode) {
          await updateCustomer(currentId, { ...form, name: formattedName });
        } else {
          const lastCustomer = customers[customers.length - 1];
          const newCustomerId = lastCustomer ? lastCustomer.customerId + 1 : 1;
          await createCustomer({ ...form, name: formattedName, customerId: newCustomerId });
        }
    
        // Clear form and fetch updated customer list
        setForm({ name: '', mobile: '', place: '', remarks: '' });
        const res = await getCustomers();
        setCustomers(res);
        setEditMode(false);
        setCurrentId(null);
      } catch (error) {
        setErrorMessage(`Error ${editMode ? 'updating' : 'adding'} customer: ${error.message}`);
        alert(`Error ${editMode ? 'updating' : 'adding'} customer: ${error.message}`); // Add alert here
      } finally {
        setLoading(false);
      }
    };
    

    const handleEdit = (customer) => {
        setEditMode(true);
        setCurrentId(customer._id);
        setForm({ name: customer.name, mobile: customer.mobile, place: customer.place, remarks: customer.remarks });
    };

    const handleDelete = async (id) => {
        try {
            await deleteCustomer(id);
            const res = await getCustomers();
            setCustomers(res);
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1683129663272-6a157e9c493c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dGFpbG9yfGVufDB8fDB8fHww)", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8 bg-opacity-90 backdrop-blur-md border border-gray-200">
              <h1 className="text-5xl font-bold text-gray-800 mb-8 text-center">Customers</h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                      <label className="block text-gray-700 font-semibold mb-2">Customer Name</label>
                      <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900"
                          required
                      />
                  </div>
                  <div>
                      <label className="block text-gray-700 font-semibold mb-2">Mobile Number</label>
                      <input
                          type="tel"
                          name="mobile"
                          value={form.mobile}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900"
                          pattern="[0-9]{10}"
                          required
                          title="Please enter a 10-digit mobile number"
                      />
                  </div>
                  <div>
                      <label className="block text-gray-700 font-semibold mb-2">Place</label>
                      <input
                          type="text"
                          name="place"
                          value={form.place}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900"
                          required
                      />
                  </div>
                  <div>
                      <label className="block text-gray-700 font-semibold mb-2">Remarks</label>
                      <input
                          type="text"
                          name="remarks"
                          value={form.remarks}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900"
                      />
                  </div>
                  <button
                      type="submit"
                      className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 shadow-md"
                  >
                      {editMode ? 'Update Customer' : 'Add Customer'}
                  </button>
              </form>
              <div className="mt-8 bg-white rounded-lg shadow-lg overflow-x-auto border border-gray-200">
                  <table className="min-w-full text-gray-900">
                      <thead>
                          <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                              <th className="px-4 py-3">Customer #</th>
                              <th className="px-4 py-3">Customer Name</th>
                              <th className="px-4 py-3">Mobile #</th>
                              <th className="px-4 py-3">Place</th>
                              <th className="px-4 py-3">Remarks</th>
                              <th className="px-4 py-3">Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          {customers.map((customer) => (
                              <tr key={customer._id} className="even:bg-gray-100 odd:bg-gray-50 hover:bg-gray-200 transition duration-300">
                                  <td className="border-t border-gray-300 px-4 py-3">{customer.customerId}</td>
                                  <td className="border-t border-gray-300 px-4 py-3">{customer.name}</td>
                                  <td className="border-t border-gray-300 px-4 py-3">{customer.mobile}</td>
                                  <td className="border-t border-gray-300 px-4 py-3">{customer.place}</td>
                                  <td className="border-t border-gray-300 px-4 py-3">{customer.remarks}</td>
                                  <td className="border-t border-gray-300 px-4 py-3 flex space-x-2">
                                      <button
                                          onClick={() => handleEdit(customer)}
                                          className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-300 shadow-md"
                                      >
                                          Edit
                                      </button>
                                      <button
                                          onClick={() => handleDelete(customer._id)}
                                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
                                      >
                                          Delete
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
  );
    
    }      

export default Customers;
  