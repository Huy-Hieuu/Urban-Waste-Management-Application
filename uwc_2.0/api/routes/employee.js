import express from 'express';
import {employeeController} from '../controllers/employee.js';

const router = express.Router()

router.get('/getAllEmployees', employeeController.getAllEmployees);
router.get('/getEmployeeByID/:id', employeeController.getEmployeeByID);
router.post('/postEmployee', employeeController.postEmployee);
router.delete('/deleteEmployee/:id', employeeController.deleteEmployee);
router.put('/updateEmployee/:id', employeeController.updateEmployee);

export default router;