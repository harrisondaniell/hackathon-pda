import express from 'express';
import { registerUser, loginUser, getUserByEmail, getUsersByCompanyEmail } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/:email', getUserByEmail);
userRouter.get('/company/:companyEmail', getUsersByCompanyEmail);

export default userRouter;
