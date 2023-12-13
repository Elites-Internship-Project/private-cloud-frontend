import React, {useState} from 'react';
import {ColorButton} from "../utils/constants";
import * as XLSX from 'xlsx';
import {Menu, MenuItem} from "@mui/material";

const ExportBtn = ({data, customHeaders}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const downloadData = (format) => {
        // Assuming you have customHeaders and data defined somewhere
        const csvContent =
            "data:text/csv;charset=utf-8," +
            [customHeaders.join(','), ...data.map((row) => Object.values(row).join(','))].join('\n');

        // CSV download logic
        if (format === 'csv') {
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', Date.now() + '.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // XLSX download logic
        else if (format === 'xlsx') {
            let ws = XLSX.utils.json_to_sheet(data);
            let wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "sheet");
            let buf = XLSX.write(wb, {bookType: 'xlsx', type: 'buffer'}); // generate a nodejs buffer
            let str = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'}); // generate a binary string in web browser
            XLSX.writeFile(wb, Date.now() + '.xlsx');
        }
    };

    return (
        <>
            <ColorButton
                id="download-csv-button"
                aria-haspopup="true"
                variant="contained"
                size={"small"}
                onClick={handleClick}
                color={"secondary"}
                width={"auto"}
            >
                Download
            </ColorButton>
            <Menu
                id="download-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => downloadData('csv')}>Download as CSV</MenuItem>
                <MenuItem onClick={() => downloadData('xlsx')}>Download as XLSX</MenuItem>
            </Menu>
        </>
    );
};

export default ExportBtn;
