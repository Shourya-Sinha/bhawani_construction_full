import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { workerBaseUrl } from "../../../axios/axiosInstance.ts";
import { persistor } from "../../store.ts";
import { updateWorkerInfo, WorkerLogout } from "./workerAuthSlice.ts";

interface RatingType {
    company: {
        companyName: string;
        email: string;
        companyAddress: string;
    };
    stars: number;
    feedback: string;
}
interface WorkerLikesDislikes {
    likesCount: number;
    dislikesCount: number;
}

interface StateType {
    isLoading: boolean;
    error: boolean;
    userInfo: Record<string, any>;
    assignedProjects: any[];
    completedProjects: any[];
    workerRatings: RatingType[];
    averageRating: number;
    likesDislikes: WorkerLikesDislikes;
}

const initialState: StateType = {
    isLoading: false,
    error: false,
    userInfo: {},
    assignedProjects: [],
    completedProjects: [],
    workerRatings: [],
    averageRating: 0,
    likesDislikes: {
        likesCount: 0,
        dislikesCount: 0,
    },
};

const slice = createSlice({
    name: 'workerAllOther',
    initialState,
    reducers: {
        updateIsLoading(state, action: { payload: { isLoading: boolean, error: boolean } }) {
            state.error = action.payload.error;
            state.isLoading = action.payload.isLoading;
        },
        updateUserInfo(state, action: { payload: Record<string, any> }) {
            state.userInfo = {
                ...state.userInfo,
                ...action.payload,
            };
        },
        addAssingedProject(state, action: { payload: any[] }) {
            state.assignedProjects = action.payload;
        },
        addCompletedProject(state, action: { payload: any[] }) {
            state.completedProjects = action.payload;
        },
        addUpdateWorkerRating(state, action: { payload: RatingType }) {
            state.workerRatings.push(action.payload);
        },
        setAllWorkerRatings(state, action: { payload: RatingType[] }) {
            state.workerRatings = action.payload;
        },
        updateAverageRatings(state, action: { payload: number }) {
            state.averageRating = action.payload;
        },
        setLikesDislikes(state, action: { payload: WorkerLikesDislikes }) {
            state.likesDislikes = action.payload;
        },
        // Optional: Optimistic update for likes count (increment or decrement)
        incrementLikes(state) {
            state.likesDislikes.likesCount += 1;
        },
        decrementLikes(state) {
            state.likesDislikes.likesCount = Math.max(0, state.likesDislikes.likesCount - 1);
        },
        incrementDislikes(state) {
            state.likesDislikes.dislikesCount += 1;
        },
        decrementDislikes(state) {
            state.likesDislikes.dislikesCount = Math.max(0, state.likesDislikes.dislikesCount - 1);
        }
    }
});

export default slice.reducer;
export const {
    decrementLikes, decrementDislikes, incrementDislikes, incrementLikes, setLikesDislikes, setAllWorkerRatings, addUpdateWorkerRating, updateAverageRatings, updateIsLoading, updateUserInfo, addAssingedProject, addCompletedProject
} = slice.actions;

interface UpdateEmail {
    email: String,
    currentPassword: String
}

interface UpdateInfo {
    userName?: String,
    phone?: Number,
    idProof?: any;
    introVideo?: any;
    profilePic?: any;
}
interface UpdateSkillInfo {
    skills?: String,
    experience?: String
}

interface AddRatings {
    stars: Number,
    feedback: String,
    workerId: String,
}

export function getWorkerLikesDislikes(workerId: string) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const response = await axiosInstance.get(`${workerBaseUrl}/WORKER_REACTION_STATS/${workerId}`);
            dispatch(updateIsLoading({ isLoading: false, error: false }));
            dispatch(setLikesDislikes({
                likesCount: response.data.data.likes,
                dislikesCount: response.data.data.dislikes,
            }));
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    };
}

// Toggle Like with optimistic update
export function toggleLikeWorker(workerId: string) {
    return async (dispatch: any, getState: () => StateType) => {
        // Optimistic update
        dispatch(incrementLikes());

        try {
            await axiosInstance.put(`${workerBaseUrl}/WORKER_UPVOTE/${workerId}`);
        } catch (error) {
            // On failure rollback optimistic update
            dispatch(decrementLikes());
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    };
}

// Toggle Dislike with optimistic update
export function toggleDislikeWorker(workerId: string) {
    return async (dispatch: any) => {
        dispatch(incrementDislikes());

        try {
            await axiosInstance.put(`${workerBaseUrl}/WORKER_DOWNVOTE/${workerId}`);
        } catch (error) {
            dispatch(decrementDislikes());
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    };
}

export function WorkerAddRating(formValues: AddRatings) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const { workerId, ...body } = formValues;
            const response = await axiosInstance.put(`${workerBaseUrl}/WORKER_RATING/${workerId}`, body);
            dispatch(updateIsLoading({ isLoading: false, error: false }));
            dispatch(addUpdateWorkerRating(response.data?.data?.rating));
            dispatch(updateAverageRatings(response.data?.data?.averageRating));
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function GetAllWorkerRating() {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const response = await axiosInstance.get(`${workerBaseUrl}/GET_ALL_WORKER_RATINGS`);
            dispatch(updateIsLoading({ isLoading: false, error: false }));
            dispatch(setAllWorkerRatings(response.data?.data?.ratings));
            dispatch(updateAverageRatings(response.data?.data?.averageRating));
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function WorkerGetAllCompletedProjects() {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const response = await axiosInstance.get(`${workerBaseUrl}/WORKER_COMPLETED_PROJECTS`);
            dispatch(updateIsLoading({ isLoading: false, error: false }));
            dispatch(addCompletedProject(response.data?.data?.projects));
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function WorkerUpdateEmailSlice(formValues: UpdateEmail) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));

        try {
            const response = await axiosInstance.put(`${workerBaseUrl}/UPDATE_WORKER_EMAIL`, formValues);

            dispatch(updateIsLoading({ isLoading: false, error: false }));
            await AsyncStorage.multiRemove(['auth_token', 'csrf_token']); // Clean multiple keys if used
            await persistor.purge();
            await dispatch(WorkerLogout());
            return response.data;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function WorkerUpdateInfo(formValues: UpdateInfo) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }))

        try {
            const response = await axiosInstance.put(`${workerBaseUrl}/UPDATE_WORKER_DETAIL`, formValues);
            dispatch(updateIsLoading({ isLoading: false, error: false }));
            dispatch(updateWorkerInfo(response.data?.data));
            dispatch(updateUserInfo(response.data?.data));
            return response.data;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function WorkerSkillsUpdate(formValues: UpdateSkillInfo) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const response = await axiosInstance.put(`${workerBaseUrl}/UPDATE_WORKER_SKILLS`, formValues);
            dispatch(updateIsLoading({ isLoading: false, error: false }));
            dispatch(updateUserInfo(response.data?.data));
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function WorkerGetAllAssignedProjects() {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const response = await axiosInstance.get(`${workerBaseUrl}/WORKER_ALL_ASSIGNED_PROJECT`);
            dispatch(updateIsLoading({ isLoading: false, error: false }));
            dispatch(addAssingedProject(response.data?.data?.projects));
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}





