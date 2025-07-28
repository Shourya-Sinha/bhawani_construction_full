import { checkCompanyApprovalStatus, protectCompanyRoute } from "../controllers/company/companyMiddleware.js";
import { deleteProject, editProject, likeOrDislikeProject, PublishProject, rateProject } from "../controllers/company/projectController.js";
import { checkWorkerApprovalStatus, protectWorkerRoute } from "../controllers/worker/workerMiddleware.js";
import router, { RDELETE, RPOST, RPUT } from "../utils/GlobalRouter.js";


RPOST("PUBLISH_PROJECT",protectCompanyRoute,checkCompanyApprovalStatus,PublishProject);
RPUT("EDIT_PROJECT/:projectId",protectCompanyRoute,checkCompanyApprovalStatus,editProject);
RDELETE("DELETE_PROJECT/:projectId",protectCompanyRoute,checkCompanyApprovalStatus,deleteProject);
RPUT("RATE_PROJECT/:projectId",protectWorkerRoute,checkWorkerApprovalStatus,rateProject);
RPUT("REACTION_ON_PROJECT/:projectId",protectWorkerRoute,checkCompanyApprovalStatus,likeOrDislikeProject);

export default router;