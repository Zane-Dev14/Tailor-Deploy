import React, { useState, useEffect } from 'react';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../api/api';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState({ empName: '', mobile: '', dailyWages: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await getEmployees();
                setEmployees(res);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };
        fetchEmployees();
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
    
      const formattedName = formatName(form.empName);
    
      try {
        const existingEmployee = employees.find(emp => emp.empName === formattedName);
    
        if (existingEmployee) {
          setErrorMessage('Employee already exists. Please edit the existing employee.');
          setLoading(false);
          alert('Employee already exists. Please edit the existing employee.');
          return;
        }
    
        if (editMode) {
          await updateEmployee(currentId, { ...form, empName: formattedName });
        } else {
          const lastEmployee = employees[employees.length - 1];
          const newEmployeeId = lastEmployee ? lastEmployee.empId + 1 : 1;
          await createEmployee({ ...form, empName: formattedName, empId: newEmployeeId });
        }
    
        setForm({ empName: '', mobile: '', dailyWages: '' });
        const res = await getEmployees();
        setEmployees(res);
        setEditMode(false);
        setCurrentId(null);
      } catch (error) {
        setErrorMessage(`Error ${editMode ? 'updating' : 'adding'} employee: ${error.message}`);
        alert(`Error ${editMode ? 'updating' : 'adding'} employee: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    const handleEdit = (employee) => {
        setEditMode(true);
        setCurrentId(employee._id);
        setForm({ empName: employee.empName, mobile: employee.mobile, dailyWages: employee.dailyWages });
    };

    const handleDelete = async (id) => {
        try {
            await deleteEmployee(id);
            const res = await getEmployees();
            setEmployees(res);
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    return (
<div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521097624001-0b8aaab53a59?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGFpbG9yfGVufDB8fDB8fHww')" }}>
    <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-lg max-w-3xl w-full">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Employees</h1>
        <form onSubmit={handleSubmit} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700 mb-1">Employee Name</label>
                    <input
                        type="text"
                        name="empName"
                        value={form.empName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Mobile Number</label>
                    <input
                        type="tel" 
                        name="mobile"
                        value={form.mobile}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        pattern="[0-9]{10}" 
                        required
                        title="Please enter a 10-digit mobile number"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Daily Wages</label>
                    <input
                        type="number"
                        name="dailyWages"
                        value={form.dailyWages}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
            </div>
            <button type="submit" className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-md mt-4 hover:bg-blue-700 transition duration-200">
                {editMode ? 'Update Employee' : 'Add Employee'}
            </button>
        </form>
        <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
                <tr>
                    <th className="px-4 py-2">Employee #</th>
                    <th className="px-4 py-2">Employee Name</th>
                    <th className="px-4 py-2">Mobile #</th>
                    <th className="px-4 py-2">Daily Wages</th>
                    <th className="px-4 py-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {employees.map((employee) => (
                    <tr key={employee._id}>
                        <td className="border px-4 py-2">{employee.empId}</td>
                        <td className="border px-4 py-2">{employee.empName}</td>
                        <td className="border px-4 py-2">{employee.mobile}</td>
                        <td className="border px-4 py-2">{employee.dailyWages}</td>
                        <td className="border px-4 py-2">
                            <button onClick={() => handleEdit(employee)} className="bg-yellow-500 text-white px-2 py-1 rounded-md mr-2 hover:bg-yellow-600 transition duration-200">Edit</button>
                            <button onClick={() => handleDelete(employee._id)} className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition duration-200">Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>

    );
};

export default Employees;
