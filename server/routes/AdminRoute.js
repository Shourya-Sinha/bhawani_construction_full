

import { adminLogin, AdminLogout, adminRegister, adminVerifyOTP, checkAdminRole, createBidByAdmin, finalizeBidByAdmin, freezeCompany, freezeWorker, getAllBidsAdmin, getAllCompanies, getAllProjectsAdmin, getAllWorkers, getBidByIdAdmin, getCompanyById, getProjectByIdAdmin, getWorkerById, protectAdminRoute, unfreezeCompany, unfreezeWorker, updateProjectByAdmin, verifyCompany, verifyWorker } from "../controllers/AdminController.js";
import router, { RGET, RPOST, RPUT } from "../utils/GlobalRouter.js";

// Admin Auth
RPOST("ADMIN_REGISTER", adminRegister);
RPOST("ADMIN_VERIFY_OTP", adminVerifyOTP);
RPOST("ADMIN_LOGIN", adminLogin);
RPOST("ADMIN_LOGOUT", AdminLogout);

// Admin main route
RPUT("ADMIN_UPDATE_PROJECT/:projectId", protectAdminRoute, checkAdminRole(["superadmin"]), updateProjectByAdmin);
RPUT("ADMIN_VERIFY_WORKER/:workerId", protectAdminRoute, checkAdminRole(["superadmin"]), verifyWorker);
RPUT("ADMIN_VERIFY_COMPANY/:companyId", protectAdminRoute, checkAdminRole(["superadmin"]), verifyCompany);
RPOST("ADMIN_CREATE_BID/:projectId", protectAdminRoute, checkAdminRole(["superadmin"]), createBidByAdmin);
RPOST("ADMIN_FYNALYZE_BID/:bidId", protectAdminRoute, checkAdminRole(["superadmin"]), finalizeBidByAdmin);
RGET("ADMIN_GET_ALL_WORKER", protectAdminRoute, checkAdminRole(["superadmin", "manager"]), getAllWorkers);
RGET("ADMIN_GET_SINGLE_WORKER/:workerId", protectAdminRoute, checkAdminRole(["superadmin", "manager"]), getWorkerById);
RPUT("ADMIN_FREEZE_WORKER/:workerId", protectAdminRoute, checkAdminRole(["superadmin"]), freezeWorker);
RPUT("ADMIN_UNFREEZE_WORKER/:workerId", protectAdminRoute, checkAdminRole(["superadmin"]), unfreezeWorker);

RGET("ADMIN_GET_ALL_COMPANY", protectAdminRoute, checkAdminRole(["superadmin", "manager"]), getAllCompanies);
RGET("ADMIN_GET_SINGLE_COMPANY/:companyId", protectAdminRoute, checkAdminRole(["superadmin", "manager"]), getCompanyById);
RPUT("ADMIN_FREEZE_COMPANY/:companyId", protectAdminRoute, checkAdminRole(["superadmin"]), freezeCompany);
RPUT("ADMIN_UNFREEZE_COMPANY/:companyId", protectAdminRoute, checkAdminRole(["superadmin"]), unfreezeCompany);

RGET("ADMIN_GET_ALL_PROJECT", protectAdminRoute, checkAdminRole(["superadmin", "manager"]), getAllProjectsAdmin);
RGET("ADMIN_GET_SINGLE_PROJECT/:projectId", protectAdminRoute, checkAdminRole(["superadmin", "manager"]), getProjectByIdAdmin);

RGET("ADMIN_GET_ALL_BIDS", protectAdminRoute, checkAdminRole(["superadmin", "manager"]), getAllBidsAdmin);
RPUT("ADMIN_GET_SINGLE_BID/:bidId", protectAdminRoute, checkAdminRole(["superadmin", "manager"]), getBidByIdAdmin);

export default router;