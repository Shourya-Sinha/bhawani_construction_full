import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { workerBaseUrl } from "../../../axios/axiosInstance.ts";
import { persistor } from "../../store.ts";

const initialState = {
    isLoggedIn: false,
    user: {},
    isLoading: false,
    error: false,
};

const slice = createSlice({
    name: 'workerAuth',
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
        updateWorkerInfo(state,action){
            state.user={
                ...state.user,
                ...action.payload
            }
        }
    }
});

export default slice.reducer;
export const {
    login, logout, updateIsLoading,updateWorkerInfo
} = slice.actions;

interface LoginFormValues {
    email: string;
    password: string;
}
interface RegisterFormValues {
    email: String, password: String, fullName: String, userName: String
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

export function LoginWorkerSlice(formValues: LoginFormValues) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));

        try {
            const response = await axiosInstance.post(`${workerBaseUrl}/LOGIN_WORKER`, formValues);

            dispatch(updateIsLoading({ isLoading: false, error: false }));
            dispatch(login({ user: response?.data?.data, isLoggedIn: true }));

            return response.data;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function RegisterWorkerSlice(formValues: RegisterFormValues) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));

        try {
            const response = await axiosInstance.post(`${workerBaseUrl}/REGISTER_WORKER`, formValues);

            dispatch(updateIsLoading({ isLoading: false, error: false }));

            return true;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function VerifyEmailWorkerSlice(formValues: VerifyEmailFormValues) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));

        try {
            const response = await axiosInstance.post(`${workerBaseUrl}/VERIFY_EMAIL_WORKER`, formValues);
            dispatch(login({ user: response?.data?.data, isLoggedIn: true }));
            dispatch(updateIsLoading({ isLoading: false, error: false }));

            return response.data;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function ResendOTPWorkerSlice(formValues: ResendOtpFormValues) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));

        try {
            const response = await axiosInstance.post(`${workerBaseUrl}/RESEND_OTP_WORKER`, formValues);

            dispatch(updateIsLoading({ isLoading: false, error: false }));

            return true;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function ForgotPWDWorkerSlice(formValues: ForgotPWDFormValues) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));

        try {
            const response = await axiosInstance.post(`${workerBaseUrl}/FORGOT_PASSWORD_WORKER`, formValues);

            dispatch(updateIsLoading({ isLoading: false, error: false }));

            return true;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function ResetPWDWorkerSlice(formValues: ResetPWDFormValues) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));

        try {
            const response = await axiosInstance.post(`${workerBaseUrl}/RESET_PASSWORD_WORKER`, formValues);

            dispatch(updateIsLoading({ isLoading: false, error: false }));

            return true;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function WorkerLogout() {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const response = await axiosInstance.post(`${workerBaseUrl}/LOGOUT_WORKER`);
            await AsyncStorage.multiRemove(['auth_token', 'csrf_token']); // Clean multiple keys if used
            await persistor.purge();

            dispatch(logout())
            return true;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}