import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { companyBaseUrl } from "../../../axios/axiosInstance.ts";
import { persistor } from "../../store.ts";
import { resetState } from "./companyAllOtherSlice.ts";

const initialState = {
    isLoggedIn: false,
    user: {},
    isLoading: false,
    error: false,
};

const slice = createSlice({
    name: 'companyAuth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.user = action.payload.user;
        },
        logout: state => {
            state.isLoggedIn = false;
            state.user = {};
            state.isLoading = false;
            state.error = false;
            AsyncStorage.removeItem('auth_token');
            AsyncStorage.removeItem('csrfToken');
        },
        updateIsLoading(state, action) {
            state.error = action.payload.error;
            state.isLoading = action.payload.isLoading;
        },
    }
});

export default slice.reducer;
export const {
    login, logout, updateIsLoading
} = slice.actions;

interface LoginFormValues {
    email: string;
    password: string;
}
interface RegisterFormValues {
    email: String, password: String, companyName: String, userName: String
}
interface VerifyEmailFormValues {
    email: String,
    otp: String
}
interface ResendOtpFormValues {
    email: String
}
interface ForgotPWDFormValues {
    email: String
}
interface ResetPWDFormValues {
    email: String, otp: String, newPassword: String
}

export function LoginCompanySlice(formValues: LoginFormValues) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));

        try {
            const response = await axiosInstance.post(`${companyBaseUrl}/COMPANY_LOGIN`, formValues);
            const token = response?.data?.data?.token;

            console.log("start setiing token in asycstorage", token)
            if (token) {
                await AsyncStorage.setItem('auth_token', token); // 👉 Ensure this happens first
                console.log('Saved token to AsyncStorage:-', token);
            }
            console.log("finish setiing token in asycstorage");
            dispatch(updateIsLoading({ isLoading: false, error: false }));
            dispatch(login({ user: response?.data?.data, isLoggedIn: true }));
            return response.data;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function RegisterCompanySlice(formValues: RegisterFormValues) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));

        try {
            const response = await axiosInstance.post(`${companyBaseUrl}/COMPANY_REGISTER`, formValues);

            dispatch(updateIsLoading({ isLoading: false, error: false }));

            return response.data;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function VerifyEmailCompanySlice(formValues: VerifyEmailFormValues) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));

        try {
            const response = await axiosInstance.post(`${companyBaseUrl}/COMPANY_VERIFY_EMAIL`, formValues);
            dispatch(login({ user: response?.data?.data, isLoggedIn: true }));
            dispatch(updateIsLoading({ isLoading: false, error: false }));
            console.log("response in register complany slice", response.data);
            return response.data;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function ResendOTPCompanySlice(formValues: ResendOtpFormValues) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));

        try {
            const response = await axiosInstance.post(`${companyBaseUrl}/COMPANY_RESEND_OTP`, formValues);

            dispatch(updateIsLoading({ isLoading: false, error: false }));

            return true;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function ForgotPWDCompanySlice(formValues: ForgotPWDFormValues) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));

        try {
            const response = await axiosInstance.post(`${companyBaseUrl}/COMPANY_FORGOT_PASSWORD`, formValues);

            dispatch(updateIsLoading({ isLoading: false, error: false }));

            return true;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function ResetPWDCompanySlice(formValues: ResetPWDFormValues) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));

        try {
            const response = await axiosInstance.post(`${companyBaseUrl}/COMPANY_RESET_PASSWORD`, formValues);

            dispatch(updateIsLoading({ isLoading: false, error: false }));

            return true;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

const cleanupAuth = async (dispatch: any) => {
    await AsyncStorage.multiRemove(['auth_token', 'csrf_token']);
    await persistor.purge();
    dispatch(logout());
};

export function CompanyLogout() {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            await axiosInstance.post(`${companyBaseUrl}/COMPANY_LOGOUT`);
            // await AsyncStorage.multiRemove(['auth_token', 'csrf_token']); // Clean multiple keys if used
            // await persistor.purge();

            // dispatch(logout())
            // return response.data;
        } catch (error: any) {
            console.warn("Server logout failed, continuing cleanup:", error?.message);
            // dispatch(updateIsLoading({ isLoading: false, error: true }));
            // return Promise.reject(error);
        } finally {
            await cleanupAuth(dispatch);
            dispatch(resetState()); 
            dispatch(updateIsLoading({ isLoading: false, error: false }));
        }
    }
}