const mongoose=require('mongoose');
const CustomerSchema = new mongoose.Schema(
    {
    customerId: {type: Number, unique: true },
    name: { type: String, required: true},
    mobile: { type: String, required: true },
    place: {type: String, required: true },
    remarks: { type: String }
}
);
module.exports = mongoose.model('Customer', CustomerSchema);