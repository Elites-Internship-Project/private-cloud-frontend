import axios from "axios";
import { BASE_URL } from "../utils/constants";

export const login = async (body) => {
    try {
        return await axios.post(BASE_URL + "/login", body);
    } catch (error) {
        console.log(error);
    }
};

export const getAllUsers = async (token) => {
    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    };
    try {
        return await axios.get(BASE_URL + "/all-users", config);

    } catch (error) {
        console.log(error);
    }

};


export const fetchSingleUser = async (token, userid) => {
    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    };
    const body = {
        userId: userid
    }
    try {
        return await axios.post(BASE_URL + "/get-user-by-id ", body, config);

    } catch (error) {
        console.log(error);
    }

};

export const createNewUser = async (token, body) => {
    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        return await axios.post(BASE_URL + "/signup", body, config);
    } catch (error) {
        console.log(error);
    }
};

export const deactivateUser = async (token, body) => {
    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    };
    try {
        return await axios.post(BASE_URL + "/deactivate", body, config);

    } catch (error) {
        console.log(error);
    }

}

export const activateUser = async (token, body) => {
    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    };
    try {
        return await axios.post(BASE_URL + "/activate", body, config);

    } catch (error) {
        console.log(error);
    }

}

export const updateUser = async (token, body) => {
    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        return await axios.post(BASE_URL + "/update-user", body, config);
    } catch (error) {
        console.log(error);
    }
};


export const getLogTable = async (token) => {

    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    };
    try {
        return await axios.get(BASE_URL + "/logs?limit=20", config);

    } catch (error) {
        console.log(error);
    }

};

export const getUserCount = async (token) => {

    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    };
    try {
        return await axios.get(BASE_URL + "/active-users", config);

    } catch (error) {
        console.log(error);
    }

};
export const getChartsData = async (token, days) => {

    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    };
    try {
        return await axios.get(BASE_URL + "/get_type_total_count?days=" + days, config);

    } catch (error) {
        console.log(error);
    }

};
