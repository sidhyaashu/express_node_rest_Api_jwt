const express = require('express');
const router = express.Router();

const employControllers = require('../../controllers/employeeControllers.js')


router.route('/')
    .get(employControllers.getAllemployee)
    .post(employControllers.createNewEmployee)
    .put(employControllers.updateEmployee)
    .delete(employControllers.deleteEmployee);

router.route('/:id')
    .get(employControllers.getEmployee);

module.exports = router;