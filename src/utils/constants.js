import {styled} from "@mui/material/styles";
import {Button} from "@mui/material";
import {blueGrey} from "@mui/material/colors";
import {getHeaders, isAuthenticated} from "../auth/helper";

var CryptoJS = require("crypto-js");

export function formatTimestamp(timestampInSeconds) {
    const date = new Date(timestampInSeconds); // Convert to milliseconds
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const getStringRoles = (userRole) => {
    if (userRole === Roles.ADMIN) {
        return "All";
    }
    const operations = ["Read", "Insert", "Edit", "Delete"];
    const mappedOperations = [];

    for (let i = 0; i < userRole.length; i++) {
        if (userRole[i] === "1") {
            mappedOperations.push(operations[i]);
        }
    }

    if (mappedOperations.length === 0) return "-";
    return mappedOperations.join(', ');
}

export const getRoles = (Role) => {

    if (Role.length === 4) {

        let temp = {
            read: Role[0] == "1" ? true : false,
            insert: Role[1] == "1" ? true : false,
            update: Role[2] == "1" ? true : false,
            delete: Role[3] == "1" ? true : false,
        };
        return temp;
    } else {
        let temp = {
            admin: true,
            read: true,
            insert: true,
            update: true,
            delete: true
        };
        return temp;
    }

}


// export const BASE_URL = "https://fetherstill-api-c4fa2236c2a6.herokuapp.com";
export const BASE_URL = "http://127.0.0.1:5000";

export const Roles = {
    ADMIN: "11111",
};


export const ColorButton = styled(Button)(({theme, width}) => ({
    color: theme.palette.getContrastText(blueGrey[700]),
    backgroundColor: blueGrey[700],
    '&:hover': {
        backgroundColor: blueGrey[900],
    },
    textTransform: 'none',
    width: width, // Use the width variable here
}));

export const dataSourceOptions = ["IN", "OUT", "PUMP"]

export const dataSourceOptionsData = ["INLET", "OUTLET", "PUMP"]
export const dataSourceMetaOptions = ["ALL", "IN", "OUT", "PUMP"]

export const timeSpanOptions = ["10", "20", "30", "60", "Life Time"]

export const getPreviousDate = (timespan) => {
    const currentDate = new Date();
    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - parseInt(timespan));
    return previousDate.toISOString().split('T')[0]
}

export const themeConstant = {
    palette: {
        primary: {
            main: "#298197", // Change this to your desired primary color
        },
        secondary: {
            main: "#C4A252", // Change this to your desired secondary color
        },
    },
}
export const companyName = "Fetherstill"

export const encryptText = (data) => {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'jghdN4TCpa7m$').toString();
    return ciphertext
}
export const decryptText = (data) => {
    var bytes = CryptoJS.AES.decrypt(data, 'jghdN4TCpa7m$');
    var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData
}


export const retrieveColumns = async (dataSrc, isEditFilter) => {
    let res = []

    if (dataSrc === 'PUMP') {
        res = JSON.parse(localStorage.getItem('pump_headers'))
    } else if (dataSrc === 'INLET' || dataSrc === 'OUTLET') {
        res = JSON.parse(localStorage.getItem('inlet_outlet_headers'))
    }

    const columns = []

    res.forEach((item) => {
        let obj = {
            field: isEditFilter ? item['1'] : item['2'],
            headerName: item['2'],
            type: "number",
            width: 150,
            align: 'center',
            headerAlign: 'center',
        }

        columns.push(obj)
    })

    return columns
}
export const pumpColumns = [
    {
        field: "A",
        headerName: "A",
        type: "number",
        width: 150,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => {

            if (params.value !== 'undefined') {
                return params.value.toString()
            } else
                return params.value
        },
    }, {
        field: "Flow",
        headerName: "Flow",
        type: "number",
        width: 150,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => {

            if (params.value !== 'undefined') {
                return params.value.toString()
            } else
                return params.value
        },
    }, {
        field: "R_sec",
        headerName: "R_sec",
        type: "number",
        width: 150,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => {

            if (params.value !== 'undefined') {
                return params.value.toString()
            } else
                return params.value
        },
    }, {
        field: "Temp_C",
        headerName: "Temp_C",
        type: "number",
        width: 150,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => {

            if (params.value !== 'undefined') {
                return params.value.toString()
            } else
                return params.value
        },
    }, {
        field: "V",
        headerName: "V",
        type: "number",
        width: 150,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => {

            if (params.value !== 'undefined') {
                return params.value.toString()
            } else
                return params.value
        },
    }, {
        field: "W",
        headerName: "W",
        type: "number",
        width: 200,
        valueFormatter: (params) => {

            if (params.value !== 'undefined') {
                return params.value.toString()
            } else
                return params.value
        },
        align: 'center',
        headerAlign: 'center',
    }, {
        field: "RECORD_DATE",
        headerName: "RECORD_DATE",
        width: 150,
        // valueGetter: (params) => {
        //     return params.value.substring(0, 10);
        // },
        align: 'center',
        headerAlign: 'center',
    },
]

export const inletOutletColumns = [
    {
        field: "Iteration",
        headerName: "Iteration",
        type: "number",
        valueFormatter: (params) => {
            return params.value
        },

        width: 100,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: "AvValue",
        headerName: "AvValue",
        type: "number",
        width: 150,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => {

            if (params.value !== 'undefined') {
                return params.value.toString()
            } else
                return params.value
        },
    },
    {
        field: "CPUTime",
        headerName: "CPU Time",
        type: "number",
        width: 150,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => {

            if (params.value !== 'undefined') {
                return params.value.toString()
            } else
                return params.value
        },
    }, {
        field: "Criteria",
        headerName: "Criteria",
        type: "number",
        width: 150,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => {

            if (params.value !== 'undefined') {
                return params.value.toString()
            } else
                return params.value
        },
    }, {
        field: "CriteriaPercentage",
        headerName: "Criteria Percentage",
        type: "number",
        width: 150,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => {

            if (params.value !== 'undefined') {
                return params.value.toString()
            } else
                return params.value
        },
    }, {
        field: "CriteriaType",
        headerName: "Criteria Type",
        type: "number",
        width: 150,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => {

            if (params.value !== 'undefined') {
                return params.value.toString()
            } else
                return params.value
        },
    }, {
        field: "Delta",
        headerName: "Delta",
        type: "number",
        width: 150,
        valueFormatter: (params) => {
            if (params.value !== 'undefined') {
                return params.value.toString()
            } else
                return params.value
        },
        align: 'center',
        headerAlign: 'center',
    }, {
        field: "Max_Value",
        headerName: "Max_Value",
        type: "number",
        width: 150,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => {

            if (params.value !== 'undefined') {
                return params.value.toString()
            } else
                return params.value
        },
    }, {
        field: "Min_Value",
        headerName: "Min_Value",
        type: "number",
        width: 150,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => {

            if (params.value !== 'undefined') {
                return params.value.toString()
            } else
                return params.value
        },
    }, {
        field: "PhysTime",
        headerName: "Phys Time",
        type: "number",
        width: 150,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => {

            if (params.value !== 'undefined') {
                return params.value.toString()
            } else
                return params.value
        },
    }, {
        field: "PrevAvRefValue",
        headerName: "PrevAvRefValue",
        type: "number",
        width: 150,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => {

            if (params.value !== 'undefined') {
                return params.value.toString()
            } else
                return params.value
        },
    }, {
        field: "Progress",
        headerName: "Progress",
        type: "number",
        width: 150,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => {

            if (params.value !== 'undefined') {
                return params.value.toString()
            } else
                return params.value
        },
    }, {
        field: "Travels",
        headerName: "Travels",
        type: "number",
        width: 150,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => {

            if (params.value !== 'undefined') {
                return params.value.toString()
            } else
                return params.value
        },
    }, {
        field: "Value",
        headerName: "Value",
        type: "number",
        width: 150,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => {

            if (params.value !== 'undefined') {
                return params.value.toString()
            } else
                return params.value
        },
    }, {
        field: "RECORD_DATE",
        headerName: "RECORD_DATE",
        width: 150,
        align: 'center',
        headerAlign: 'center',
    },
]