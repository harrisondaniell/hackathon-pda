import express from 'express';
import { getCompanies, getCompanyById, createCompany, updateCompany, deleteCompany } from '../controllers/companyController.js';

const companyRouter = express.Router();

companyRouter.get('/', getCompanies);
companyRouter.get('/:id', getCompanyById);
companyRouter.post('/create', createCompany);
companyRouter.patch('/update/:id', updateCompany);
companyRouter.delete('/delete/:id', deleteCompany);

export default companyRouter;
