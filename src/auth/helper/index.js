import {BASE_URL, decryptText, encryptText} from "../../utils/constants";
import axios from "axios";

export const isAuthenticated = () => {
    if (localStorage.getItem("jwt")) {

        let v = JSON.parse(decryptText(JSON.parse(localStorage.getItem("jwt")).data));
        console.log(v);
        return v;
    } else return false;
};


export const getAuthenticatedData = (data) => {

    return {
        user: data.data,
        token: data.token

    }
}

export const authenticate = (data, next) => {

    if (typeof window !== "undefined") {
        localStorage.setItem("jwt", JSON.stringify({data: encryptText((data))}));
        next();
    }
};

export const signout = (next) => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("jwt");

    }
    next();
};

export const getHeaders = async () => {
    const authenticatedData = isAuthenticated();
    const {token} = getAuthenticatedData(authenticatedData)
    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    }

    await axios.get(BASE_URL + `/get_column_names/PUMP`, config).then((res) => {
        if (res) {
            localStorage.setItem('pump_headers', JSON.stringify(res.data.data))
        }
    })
    await axios.get(BASE_URL + `/get_column_names/INLET`, config).then((res) => {
        if (res) {
            localStorage.setItem('inlet_outlet_headers', JSON.stringify(res.data.data))
        }
    })
}
