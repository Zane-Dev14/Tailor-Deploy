import axios from 'axios';

const API = axios.create({
  baseURL: 'https://tailor-tracker.onrender.com/api', // Adjust this base URL according to your backend setup
  withCredentials: true,
});

export const createEmployee = async (employee) => {
  try {
      const response = await API.post('/employees', employee);
      return response.data;
  } catch (error) {
      throw error.response.data;
  }
};
export const getEmployees = async () => {
  try {
    const response = await API.get('/employees');
    console.log('Employees fetched:', response.data); // Add logging to see the response
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error.message; // Adjust error handling
  }
};


export const updateEmployee = async (id, employee) => {
  try {
      const response = await API.put(`/employees/${id}`, employee);
      return response.data;
  } catch (error) {
      throw error.response.data;
  }
};

export const deleteEmployee = async (id) => {
  try {
      const response = await API.delete(`/employees/${id}`);
      return response.data;
  } catch (error) {
      throw error.response.data;
  }
};
    

     // Add the following functions to api.js

  // Function to create an order
  export const createOrder = async (order) => {
    try {
      const response = await API.post('/orders', order);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  // Function to get all orders
  export const getOrders = async () => {
    try {
      const response = await API.get('/orders');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  // Function to update an order by ID
  export const updateOrder = async (id, order) => {
    try {
      const response = await API.put(`/orders/${id}`, order);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  // Function to delete an order by ID
  export const deleteOrder = async (id) => {
    try {
      const response = await API.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  export const login = async (credentials) => {
    try {
        const response = await API.post('/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};export const logout = async () => {
  try {
      const response = await API.post('/login/logout'); // Ensure the URL matches
      return response.data;
  } catch (error) {
      throw error.response ? error.response.data : error.message;
  }
};


export const createCustomer = async (customer) => {
  try {
      const response = await API.post('/customers', customer);
      return response.data;
  } catch (error) {
      throw error.response.data;
  }
};

export const getCustomers = async () => {
  try {
      const response = await API.get('/customers');
      return response.data;
  } catch (error) {
      throw error.response.data;
  }
};

export const updateCustomer = async (id, customer) => {
  try {
      const response = await API.put(`/customers/${id}`, customer);
      return response.data;
  } catch (error) {
      throw error.response.data;
  }
};

export const deleteCustomer = async (id) => {
  try {
      const response = await API.delete(`/customers/${id}`);
      return response.data;
  } catch (error) {
      throw error.response.data;
  }
};
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

      export default API;
