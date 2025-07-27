const Employee = require('../models/Employee');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Public
exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Public
exports.getEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private/Admin
exports.createEmployee = async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
