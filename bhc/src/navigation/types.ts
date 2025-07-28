export type RootStackParamList = {
  // Add all your routes here
  MainTabs: undefined;
  CompanyLogin: undefined;
  CompanyRegister: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  WorkerLogin: undefined;
  WorkerRegister: undefined;
  WorkerForgotPassword: undefined;
  WorkerResetPassword: undefined;
  CompanyDashboard: undefined;
  WorkerDashboard: undefined;
  EditCompanyProfile: undefined; // Add this line
  // ... other routes
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}