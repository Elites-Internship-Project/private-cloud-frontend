import axios from "axios";
import {BASE_URL} from "../utils/constants";

export const login = async (body) => {
    try {
        return await axios.post(BASE_URL + "/login", body);
    } catch (error) {
        console.log(error);
    }
};

export const changePassword = async (token, body) => {
    const config = {
        headers: {
            // Accept: "application/json",
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        return await axios.post(BASE_URL + "/change-password", body, config);
    } catch (error) {
        console.log(error);
    }
};

