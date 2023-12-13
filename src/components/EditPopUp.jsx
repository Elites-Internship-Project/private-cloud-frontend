import React, {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import style from "../css/common.module.css"
import {BASE_URL, dataSourceOptionsData, inletOutletColumns, pumpColumns} from "../utils/constants";
import {MenuItem} from "@mui/material";
import {useTheme} from "@mui/system";
import {useLoading} from "../LoadingProvider";
import axios from "axios";
import {getAuthenticatedData, isAuthenticated} from "../auth/helper";

const EditPopup = ({open, onClose, filters}) => {
    const [dataSource, setDataSource] = useState('INLET');
    const [selectedColumn, setSelectedColumn] = useState(inletOutletColumns[0].field);
    const [fromValue, setFromValue] = useState('0');
    const [replaceValue, setReplaceValue] = useState('0');
    const {isLoading, startLoading, stopLoading} = useLoading();
    const theme = useTheme();
    const authenticatedData = isAuthenticated();
    const {user, token} = getAuthenticatedData(authenticatedData);

    console.log("filter edit", filters)
    const config = {
        headers: {
            Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${token}`,
        },
    };
    const handleClose = () => {
        onClose();
    };

    const handleSave = () => {
        // Handle the logic when the save button is clicked
        // Convert values to the desired format
        // startLoading();

        const body = {
            "data_source": dataSource,
            "column": selectedColumn,
            "from_replace": fromValue,
            "to_replace": replaceValue,
            "filters": handleEditFilterValues()
        }
        axios.post(BASE_URL + '/edit_filtered_data', body, config)
            .then((res) => {
                console.log("res", res);
                setDataSource('INLET')
                setSelectedColumn(inletOutletColumns[0].field)
                setFromValue('0')
                setReplaceValue('0')
                onClose();
            });
    };

    const handleEditFilterValues = () => {
        let tempHeaders = JSON.parse(localStorage.getItem('pump_headers'))

        let tempHeadersIn = JSON.parse(localStorage.getItem('inlet_outlet_headers'))

        const subarr = tempHeaders.map(item => item[1])
        const keys = Object.keys(filters);
        console.log("keys :: => ::", keys)
        subarr.forEach((item) => {
            keys.forEach((key) => {
                if (item === key) {
                    return filters
                } else {
                    return {}
                }
            })
        })
        return {};
    }


    return (
        <>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Data</DialogTitle>
                <DialogContent sx={{pt: `${theme.spacing(2)} !important`}}
                               style={{
                                   display: "flex",
                                   justifyContent: "center",
                                   alignItems: "center",
                                   flexDirection: "column"
                               }}>
                    <TextField
                        label="Select Data Source"
                        select
                        style={{width: "50%", marginBottom: "20px"}}
                        value={dataSource}
                        onChange={(e) => {
                            setDataSource(e.target.value)
                            if (e.target.value === 'PUMP') {
                                setSelectedColumn(pumpColumns[0].field)
                            }
                        }}
                    >
                        {dataSourceOptionsData.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Select Column"
                        select
                        style={{width: "50%", marginBottom: "20px"}}
                        value={selectedColumn}
                        onChange={(e) => {
                            setSelectedColumn(e.target.value)
                        }}
                    >
                        {dataSource === 'PUMP' ? pumpColumns.map((option) => (
                            <MenuItem key={option.field} value={option.field}>
                                {option.field}
                            </MenuItem>
                        )) : inletOutletColumns.map((option) => (
                            <MenuItem key={option.field} value={option.field}>
                                {option.field}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Find Value"
                        style={{width: "50%", marginBottom: "20px"}}
                        value={fromValue}
                        onChange={(e) => setFromValue(e.target.value)}
                    />

                    <TextField
                        label="Replace Value"
                        style={{width: "50%", marginBottom: "10px"}}
                        value={replaceValue}
                        onChange={(e) => setReplaceValue(e.target.value)}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>

        </>
    );
};

export default EditPopup;
