import { NavigatorScreenParams } from "@react-navigation/core";

export type RootStackParamList = {
  // Add all your routes here
  // MainTabs: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
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
  CompanyVerifyEmail:undefined;
  WorkerVerifyEmail:undefined;
  // ... other routes
};

export type MainTabParamList = {
  Home: undefined;
  Stats: undefined;
  CompanyProfile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}