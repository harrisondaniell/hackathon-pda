import express from 'express';
import { registerUser, loginUser, getUserByEmail, getUsersByCompanyEmail } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.get('/:email', getUserByEmail);
userRouter.get('/company/:companyEmail', getUsersByCompanyEmail);
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

export default userRouter;
