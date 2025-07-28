import { createSlice } from "@reduxjs/toolkit";
import axiosInstance, { projectUrl } from "../../../axios/axiosInstance";
import { getandsetAllProjectsofCompany } from "../Company/companyAllOtherSlice";


const initialState = {
    isLoading: false,
    error: false,
};

const slice = createSlice({
    name: 'projectState',
    initialState,
    reducers: {
        updateIsLoading(state, action) {
            state.error = action.payload.error;
            state.isLoading = action.payload.isLoading;
        },
    }
});

export const {
    updateIsLoading
} = slice.actions;

interface publishProject {
    budget?: number,
    deadline?: string,
    bidClosingDate?: Date,
    estimatedDuration?: string,
    category?: string,
    requirements?: string,
    carpetArea?: number,
    location?: string,
    priorityLevel?: string,
    locationCoords?: string
}

export function createNewProject(formValues: publishProject) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const response = await axiosInstance.post(`${projectUrl}/PUBLISH_PROJECT`, formValues);
            dispatch(updateIsLoading({ isLoading: false, error: false }));
            dispatch(getandsetAllProjectsofCompany(response?.data?.data));
            return response.data;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

