import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = "http://localhost:5000/api/v1/";

export const companyBaseUrl = `${baseUrl}/COMPANY`;
export const workerBaseUrl = `${baseUrl}/WORKER`;
export const projectUrl = `${baseUrl}/PROJECT`;



const axiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('auth_token');
            if (token) {
                console.log('Token in interceptors:', token);
                config.headers.Authorization = `Bearer ${token}`;  // Attach the token to Authorization header
                config.headers['Cookie'] = token;  // Attach the token to Authorization header
            }
            // Attach CSRF token
            try {
                const response = await axios.get(`${baseUrl}shawn-shoaurya-csrf-token-protection-v1`, {
                    withCredentials: true,
                });
                const csrfToken = response.data.csrfToken;
                config.headers['X-CSRF-Token'] = csrfToken;
            } catch (error) {
                console.error("Failed to fetch CSRF token:", error);
            }
        } catch (error) {
            console.error('Error reading token:', error);
        }
        return config;
    },
    (error) => {
        // console.error('Request error:', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,  // Pass successful responses through
    (error) => {
        if (error.response) {
            console.error('API Error Response:', error.response);
            // Always return the actual API error message if available
            return Promise.reject(error.response.data || { message: 'Unknown error occurred' });
        } else if (error.request) {
            console.error('No response received:', error.request);
            return Promise.reject({ message: 'No response from server. Please check your network.' });
        } else {
            console.error('Error during request setup:', error.message);
            return Promise.reject({ message: 'An error occurred during the request.' });
        }
    }
);


export default axiosInstance;