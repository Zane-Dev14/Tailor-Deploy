const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    empId: { type: Number, unique: true },
    empName: { type: String, required: true },
    mobile: { type: String, required: true },
    dailyWages: { type: Number, required: true }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
