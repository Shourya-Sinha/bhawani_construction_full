import { createSlice } from "@reduxjs/toolkit";
import axiosInstance, { companyBaseUrl } from "../../../axios/axiosInstance";
import { CompanyLogout } from "./companyAuthSlice";

interface RatingType {
    worker: {
        fullName: string;
        email: string;
        workerAddress: string;
    };
    stars: number;
    feedback: string;
}
interface BidType {
    // Bid fields
    bidId: string;
    offeredAmount: number;
    message?: string;
    response?: string;
    status: 'pending' | 'accepted' | 'rejected' | 'countered';
    counterOffer?: number;
    finalAmountAgreed?: number;
    bidCreatedAt: string;
    bidUpdatedAt?: string;

    // ProposedBy fields
    proposedById?: string;
    proposedByName?: string;
    proposedByEmail?: string;
    proposedByPhone?: string;

    // Project fields
    projectId: string;
    projectName: string;
    projectCreatedAt: string;
    projectBudget: number;
    projectCategory: string;
    projectPriority: 'low' | 'medium' | 'high';

    // Location fields
    locationLat?: number;
    locationLng?: number;

    // Company fields
    companyName: string;
    companyEmail: string;
    companyPhone: string;
}

interface CompanyLikesDislikes {
    likesCount: number;
    dislikesCount: number;
}

interface BidResponseData {
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    projectName: string;
    projectStartDate: string;
    location: {
        lat?: number;
        lng?: number;
    };
    offeredAmount: number;
    counterOffer: number | null;
    status: string;
    response: string;
    bidStartTime: string;
}

interface ResponseOnBidPayload {
    bidId: string;
    response: 'accepted' | 'rejected' | 'countered';
    counterOffer?: number;
}

interface StateType {
    isLoading: boolean;
    error: boolean;
    companyInfo: Record<string, any>;
    companyRatings: RatingType[];
    averageRating: number;
    likesDislikes: CompanyLikesDislikes;
    allBids: BidType[];
    allProjects: [];
}

const initialState: StateType = {
    isLoading: false,
    error: false,
    companyInfo: {},
    companyRatings: [],
    averageRating: 0,
    likesDislikes: {
        likesCount: 0,
        dislikesCount: 0,
    },
    allBids: [],
    allProjects: [],

};

const slice = createSlice({
    name: 'companyOther',
    initialState,
    reducers: {
        resetState: () => initialState,
        updateBidInList(state, action: { payload: { bidId: string; updatedData: Partial<BidType> } }) {
            const index = state.allBids.findIndex(bid => bid.bidId === action.payload.bidId);
            if (index != -1) {
                state.allBids[index] = {
                    ...state.allBids[index],
                    ...action.payload.updatedData
                }
            }
        },
        getandSetAllBids(state, action: { payload: BidType[] }) {
            state.allBids = action.payload;
        },
        updateIsLoading(state, action: { payload: { isLoading: boolean, error: boolean } }) {
            state.error = action.payload.error;
            state.isLoading = action.payload.isLoading;
        },
        updateCompanyInfo(state, action: { payload: Record<string, any> }) {
            console.log("slice called when data fetched",action.payload)
            state.companyInfo = { ...state.companyInfo, ...action.payload }
        },
        updateAverageRatings(state, action: { payload: number }) {
            state.averageRating = action.payload;
        },
        addUpdateCompanyRating(state, action: { payload: RatingType }) {
            state.companyRatings.push(action.payload);
        },
        setAllCompanyRatings(state, action: { payload: RatingType[] }) {
            state.companyRatings = action.payload;
        },
        setLikesDislikes(state, action: { payload: CompanyLikesDislikes }) {
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
        },
        getandsetAllProjectsofCompany(state, action) {
            state.allProjects = {
                ...state.allProjects,
                ...action.payload
            }
        }
    }
});

export default slice.reducer;
export const {
    resetState,getandsetAllProjectsofCompany, updateBidInList, getandSetAllBids, setAllCompanyRatings, addUpdateCompanyRating, decrementDislikes, incrementDislikes, decrementLikes, updateIsLoading, updateCompanyInfo, updateAverageRatings, setLikesDislikes, incrementLikes
} = slice.actions;

interface CompanyProfileUpdate {
    companyId?: string;
    companyName?: string;
    phone?: number;
    companyLogo?: any;
    email?: string;
    currentPassword?: string;
}

interface AddRatings {
    stars: Number,
    feedback: String,
    companyId: String,
}

interface responseONBID {
    response: string,
    counterOffer: number,
    bidId: string
}

export function getandsetCompanyinfo() {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const response = await axiosInstance.get(`${companyBaseUrl}/GET_COMPANY_ALL_BASIC_INFO`);
            dispatch(updateCompanyInfo(response?.data?.data?.data));
            console.log("info data in slice funciton",response.data);
            dispatch(updateIsLoading({ isLoading: false, error: false }))
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}



export function FetchSingleProjects(projectId: string) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const response = await axiosInstance.get(`${companyBaseUrl}/COMPANY_GET_SINGLE_PROJECT/${projectId}`);
            dispatch(updateIsLoading({ isLoading: false, error: false }));
            return response.data;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function FetchAllProjects() {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const response = await axiosInstance.get(`${companyBaseUrl}/COMPANY_ALL_PROJECT`);
            dispatch(getandsetAllProjectsofCompany(response?.data?.projects))
            dispatch(updateIsLoading({ isLoading: false, error: false }));
            return response.data;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function fetchBidDetails(bidId: string) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const response = await axiosInstance.get(`${companyBaseUrl}/COMPANY_GET_SINGLE_BID/${bidId}`);
            dispatch(updateIsLoading({ isLoading: false, error: false }));
            return response.data;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function getAllBid() {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const response = await axiosInstance.put(`${companyBaseUrl}/COMPANY_ALL_BIDS`)
            dispatch(getandSetAllBids(response?.data?.bids))
            dispatch(updateIsLoading({ isLoading: false, error: false }));
            return response.data;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function respondOnBid(formValues: responseONBID) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const { bidId, ...body } = formValues
            const response = await axiosInstance.put(`${companyBaseUrl}/RESPONSE_ON_BID_BY_COMPANY/${bidId}`, body)
            dispatch(updateBidInList({ bidId, updatedData: response?.data?.responseData }));
            dispatch(updateIsLoading({ isLoading: false, error: false }));
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function getCompanyLikesDislikes(companyId: string) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const response = await axiosInstance.get(`${companyBaseUrl}/REACTION_STATS/${companyId}`);
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
export function toggleLikeCompany(companyId: string) {
    return async (dispatch: any, getState: () => StateType) => {
        // Optimistic update
        dispatch(incrementLikes());

        try {
            await axiosInstance.put(`${companyBaseUrl}/COMPANY_UPVOTES/${companyId}`);
        } catch (error) {
            // On failure rollback optimistic update
            dispatch(decrementLikes());
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    };
}

// Toggle Dislike with optimistic update
export function toggleDislikeCompany(companyId: string) {
    return async (dispatch: any) => {
        dispatch(incrementDislikes());

        try {
            await axiosInstance.put(`${companyBaseUrl}/COMPANY_DOWNVOTES/${companyId}`);
        } catch (error) {
            dispatch(decrementDislikes());
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    };
}

export function CompanyAddRating(formValues: AddRatings) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const { companyId, ...body } = formValues;
            const response = await axiosInstance.put(`${companyBaseUrl}/COMPANY_RATE_BY_WORKER/${companyId}`, body);
            dispatch(updateIsLoading({ isLoading: false, error: false }));
            dispatch(addUpdateCompanyRating(response.data?.data?.rating));
            dispatch(updateAverageRatings(response.data?.data?.averageRating));
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function GetAllCompanyRating() {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const response = await axiosInstance.get(`${companyBaseUrl}/GET_ALLRATINGS_COMPANY`);
            dispatch(updateIsLoading({ isLoading: false, error: false }));
            dispatch(setAllCompanyRatings(response.data?.data?.ratings));
            dispatch(updateAverageRatings(response.data?.data?.averageRating));
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function UpdateCompanyInfoSlice(formValues: CompanyProfileUpdate) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const response = await axiosInstance.put(`${companyBaseUrl}/COMPANY_PROFILE_UPDATE`, formValues);

            dispatch(updateIsLoading({ isLoading: false, error: false }));
            dispatch(updateCompanyInfo(response?.data?.data));

            return response.data;
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function UpdateCompanyLogo(formValues: CompanyProfileUpdate) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const response = await axiosInstance.put(`${companyBaseUrl}/COMPANY_ADD_LOGO`, formValues);
            dispatch(updateIsLoading({ isLoading: false, error: false }))
            dispatch(updateCompanyInfo(response.data?.data))
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}

export function UpdateCompanyCred(formValues: CompanyProfileUpdate) {
    return async (dispatch: any) => {
        dispatch(updateIsLoading({ isLoading: true, error: false }));
        try {
            const response = await axiosInstance.post(`${companyBaseUrl}/COMPANY_UPDATE_EMAIL`, formValues);
            dispatch(updateIsLoading({ isLoading: false, error: false }))
            // dispatch(updateCompanyInfo(response.data?.data))
            await dispatch(CompanyLogout());
        } catch (error) {
            dispatch(updateIsLoading({ isLoading: false, error: true }));
            return Promise.reject(error);
        }
    }
}




