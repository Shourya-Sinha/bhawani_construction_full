

import { checkCompanyApprovalStatus, protectCompanyRoute } from "../controllers/company/companyMiddleware.js";
import { addWorkerRating, getAssignedProjects, getCompletedProjects, getWorkerLikesDislikes, getWorkerRatings, toggleDislikeWorker, toggleLikeWorker, updateBasicInfo, updateSkillsExperience, updateWorkerEmail } from "../controllers/worker/workController.js";
import { WorkerCustomRegister, WorkerForgotPassword, WorkerLogin, WorkerLogout, WorkerResendOTP, WorkerResetPassword, WorkerVerifyEmail } from "../controllers/worker/WorkerAuthController.js";
import { checkWorkerApprovalStatus, protectWorkerRoute, uploadWorkerFilesMulterMiddleware } from "../controllers/worker/workerMiddleware.js";
import router, { RGET, RPOST, RPUT } from "../utils/GlobalRouter.js";

//Auth
RPOST("REGISTER_WORKER",WorkerCustomRegister);
RPOST("VERIFY_EMAIL_WORKER",WorkerVerifyEmail);
RPOST("RESEND_OTP_WORKER",WorkerResendOTP);
RPOST("FORGOT_PASSWORD_WORKER",WorkerForgotPassword);
RPOST("RESET_PASSWORD_WORKER",WorkerResetPassword);
RPOST("LOGIN_WORKER",WorkerLogin);
RPOST("LOGOUT_WORKER",WorkerLogout);

// After Auth Flow Without Admin Approval
RPUT("UPDATE_WORKER_EMAIL",protectWorkerRoute,updateWorkerEmail);
RPUT("UPDATE_WORKER_DETAIL",protectWorkerRoute,uploadWorkerFilesMulterMiddleware,updateBasicInfo);
RPUT("UPDATE_WORKER_SKILLS",protectWorkerRoute,updateSkillsExperience);


//After Auth Flow With Admin Approval
RGET("WORKER_ALL_ASSIGNED_PROJECT",protectWorkerRoute,checkWorkerApprovalStatus,getAssignedProjects);
RGET("WORKER_COMPLETED_PROJECTS",protectWorkerRoute,checkWorkerApprovalStatus,getCompletedProjects);
RGET("WORKER_REACTION_STATS/:workerId",protectWorkerRoute,checkWorkerApprovalStatus,getWorkerLikesDislikes);
RGET("GET_ALL_WORKER_RATINGS",protectWorkerRoute,checkWorkerApprovalStatus,getWorkerRatings);

RPUT("WORKER_RATING/:workerId",protectCompanyRoute,checkCompanyApprovalStatus,addWorkerRating);
RPUT("WORKER_UPVOTE/:workerId",protectCompanyRoute,checkCompanyApprovalStatus,toggleLikeWorker);
RPUT("WORKER_DOWNVOTE/:workerId",protectCompanyRoute,checkCompanyApprovalStatus,toggleDislikeWorker);

export default router;