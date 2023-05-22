import axios from "axios";

// axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
const baseUrl = "https://chatapp-backend-7895.onrender.com";
axios.defaults.withCredentials = true;

export const getUserData = async () => {
    try {
        const userData = await axios.get(`${baseUrl}/user/userdetails`);
        return userData;
    } catch (error) {
        return error;
    }
}


export const registerUser = async (userData) => {
    try {
        const { data } = await axios
            .post(`${baseUrl}/user/register`, userData);
        return data;
    } catch (error) {
        return error;
    }
}

export const loginUser = async (credentials) => {
    try {
        const { data } = await axios.post(`${baseUrl}/user/login`, credentials);
        return data;
    } catch (error) {
        return error;
    }
}


export const getMessages = async (userId) => {
    try {
        const messages = await axios.get(`${baseUrl}/user/messages/${userId}`);
        return messages;
    } catch (error) {
        return error;
    }
}
export const getAllUsers = async () => {
    try {
        const users = await axios.get(`${baseUrl}/user/people`);
        return users;
    } catch (error) {
        return error;
    }
}

export const logoutUser = async () => {
    try {
        const data = await axios.post(`${baseUrl}/user/logout`);
        return data;
    } catch (error) {
        return error;
    }
}