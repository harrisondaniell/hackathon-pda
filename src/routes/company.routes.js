import express from "express";
import {
  // getCompanies,
  getCompanyByEmail,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";

const companyRouter = express.Router();

// companyRouter.get('/', getCompanies);
companyRouter.get("/:id", getCompanyByEmail);
companyRouter.post("/create", createCompany);
companyRouter.patch("/update/:id", updateCompany);
companyRouter.delete("/delete/:id", deleteCompany);

export default companyRouter;
