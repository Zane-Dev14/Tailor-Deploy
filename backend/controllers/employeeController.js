const Employee = require('../models/Employee');

exports.createOrUpdateEmployee = async (req, res) => {
    try {
        const { empName, mobile, dailyWages } = req.body;
        const formattedName = empName
            .toLowerCase()  
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        let employee = await Employee.findOne({ empName: formattedName });

        if (employee) {
            return res.status(400).json({ message: 'Employee already exists. Please edit the existing employee.' });
        } else {
            const lastEmployee = await Employee.findOne().sort({ empId: -1 });
            const newEmployeeId = lastEmployee ? lastEmployee.empId + 1 : 1;
            employee = new Employee({
                empId: newEmployeeId,
                empName: formattedName,
                mobile,
                dailyWages
            });

            await employee.save();
            res.status(201).json(employee);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err });
    }
};

exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
