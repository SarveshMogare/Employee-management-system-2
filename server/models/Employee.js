const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
        enum: ['HR', 'Development', 'Marketing', 'Finance', 'Operations']
    },
    position: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    hireDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Active', 'On Leave', 'Terminated'],
        default: 'Active'
    }
}, {
    timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
