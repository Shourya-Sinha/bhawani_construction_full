import express from "express";
const mainRouter = express.Router();

import projectRouter from './ProjectRoute.js';
import companyRouter from './companyRoute.js';
import workerRouter from './workerRoute.js';
import adminRouter from './AdminRoute.js';

// Mount by nameSpace

mainRouter.use("/PROJECT",projectRouter);
mainRouter.use("/COMPANY",companyRouter);
mainRouter.use("/WORKER",workerRouter);
mainRouter.use("/ADMIN",adminRouter);

export default mainRouter;