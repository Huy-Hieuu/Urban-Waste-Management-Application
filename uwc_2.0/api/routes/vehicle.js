import express from 'express';
import {vehicleController} from '../controllers/vehicle.js';

const router = express.Router()

router.get('/getAllVehicles', vehicleController.getAllVehicles);
router.get('/getVehicleByID/:id', vehicleController.getVehicleByID);
router.post('/postVehicle', vehicleController.postVehicle);
router.delete('/deleteVehicle/:id', vehicleController.deleteVehicle);
router.put('/updateVehicle/:id', vehicleController.updateVehicle);

export default router;