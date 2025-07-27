const express = require('express');
const router = express.Router();
const {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeeController');

// Routes for /api/employees
router.route('/')
    .get(getEmployees)
    .post(createEmployee);

// Routes for /api/employees/:id
router.route('/:id')
    .get(getEmployee)
    .put(updateEmployee)
    .delete(deleteEmployee);

module.exports = router;
