
import { CompanyCustomRegister, CompanyForgotPassword, CompanyLogin, CompanyLogout, CompanyResendOTP, CompanyResetPassword, CompanyVerifyEmail } from "../controllers/company/companyAuthController.js";
import { addComapanyRating, getAllBids, getAllProjects, getBidById, getCompanyLikesDislikes, getCompanyRatings, getProjectById, respondToBidByCompany, toggleDislikeCompany, toggleLikeCompany, updateCompanyEmail, updateCompanyLogo, updateCompanyProfileDetails } from "../controllers/company/CompanyController.js";
import { checkCompanyApprovalStatus, protectCompanyRoute } from "../controllers/company/companyMiddleware.js";
import router, { RGET, RPOST, RPUT } from "../utils/GlobalRouter.js";


// Company Auth
RPOST("COMPANY_REGISTER", CompanyCustomRegister);
RPOST("COMPANY_VERIFY_EMAIL", CompanyVerifyEmail);
RPOST("COMPANY_LOGIN", CompanyLogin);
RPOST("COMPANY_LOGOUT", CompanyLogout);
RPOST("COMPANY_RESEND_OTP", CompanyResendOTP);
RPOST("COMPANY_FORGOT_PASSWORD", CompanyForgotPassword);
RPOST("COMPANY_RESET_PASSWORD", CompanyResetPassword);

// Company After Auth Main Controller wihtout Approval
RPUT("COMPANY_PROFILE_UPDATE",protectCompanyRoute,updateCompanyProfileDetails);
RPUT("COMPANY_ADD_LOGO",protectCompanyRoute,updateCompanyLogo);
RPUT("RESPONSE_ON_BID_BY_COMPANY/:bidId",protectCompanyRoute,respondToBidByCompany);

RGET("GET_ALLRATINGS_COMPANY",protectCompanyRoute,getCompanyRatings);
RGET("REACTION_STATS/:companyId",protectCompanyRoute,getCompanyLikesDislikes);
RGET("COMPANY_ALL_PROJECT",protectCompanyRoute,checkCompanyApprovalStatus,getAllProjects);
RGET("COMPANY_ALL_BIDS",protectCompanyRoute,checkCompanyApprovalStatus,getAllBids);
RGET("COMPANY_GET_SINGLE_BID/:bidId",protectCompanyRoute,checkCompanyApprovalStatus,getBidById);

// Company After Auth Main Controller wiht Approval
RPUT("COMPANY_UPDATE_EMAIL",protectCompanyRoute,checkCompanyApprovalStatus,updateCompanyEmail);
RPUT("COMPANY_RATE_BY_WORKER/:companyId",protectCompanyRoute,checkCompanyApprovalStatus,addComapanyRating);
RPUT("COMPANY_UPVOTES/:companyId",protectCompanyRoute,checkCompanyApprovalStatus,toggleLikeCompany);
RPUT("COMPANY_DOWNVOTES/:companyId",protectCompanyRoute,checkCompanyApprovalStatus,toggleDislikeCompany);
RGET("COMPANY_GET_SINGLE_PROJECT/:projectId",protectCompanyRoute,checkCompanyApprovalStatus,getProjectById);

export default router