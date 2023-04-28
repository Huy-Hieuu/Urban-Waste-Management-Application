import express from 'express';
import {OptimizerController} from '../controllers/optimizer.js';

const router = express.Router()

router.post('/postRoute',OptimizerController.Optimizer);

export default router;