import { Router } from 'express';
import {UserController} from "../controller/UserController";

const router: Router = Router();

// Example route below
const userController = new UserController();

// User routes
router.get('/users', userController.getAll);
router.get('/users/id', userController.getById);


export default router;