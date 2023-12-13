import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {DataGrid} from "@mui/x-data-grid";
import {Dropdown} from "../components/Dropdown";
import {FormGroup, Stack} from "@mui/material";
import CustomNoRowsOverlay from "../components/CustomNoRowsOverlay";
import {getAuthenticatedData, isAuthenticated} from "../auth/helper";
import {
    BASE_URL,
    ColorButton,
    dataSourceMetaOptions,
    formatTimestamp,
    getPreviousDate, getRoles,
    timeSpanOptions,
} from "../utils/constants";
import Base from "../components/base";
import {ToastContainer} from "react-toastify";
import AWS from "aws-sdk";
import {useLoading} from "../LoadingProvider";
import {useNavigate} from "react-router-dom";
import FormControlLabel from "@mui/material/FormControlLabel";
import style from "../css/common.module.css"
import Switch from '@mui/material/Switch';

AWS.config.update({
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
});

export const s3 = new AWS.S3();

const deleteFilesFromS3 = (keys) => {
    keys.forEach((item) => {
        const params = {
            Bucket: '', // Replace with your S3 bucket name
            Key: item["FILENAME"],
        };
        s3.deleteObject(params).promise().then(res => {
            console.log(res)
        });
    })
}

function FileMetaData() {
    const [data, setData] = useState([]);
    const [limitCount, setLimitCount] = useState(20);
    const [dataSource, setDataSource] = useState("ALL");
    const authenticatedData = isAuthenticated();
    const {user, token} = getAuthenticatedData(authenticatedData);
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const currentDate = new Date().toISOString().split("T")[0];
    const notifyRef = useRef(null);
    const {isLoading, startLoading, stopLoading} = useLoading();
    const [showIsDelete, setShowIsDelete] = useState(false);
    const roles = getRoles(user.Role);
    const navigate = useNavigate();


    useEffect(() => {
        fetchDataBasedOnDataSource()
    }, []);

    useEffect(() => {
        fetchDataBasedOnDataSource();
    }, [dataSource, limitCount, showIsDelete]);


    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    const getFilterData = (data) => {
        data.forEach((item) => {
            item.id = item["ID"];
        });
        if (!showIsDelete) {
            let filterData = data.filter(item => !item['IS_DELETED']);
            setData(filterData)
        } else {
            setData(data);
        }
    }

    const fetchDataBasedOnDataSource = async () => {
        if (dataSource !== "ALL") {
            startLoading()
            await axios
                .get(
                    BASE_URL + `/get_all_file_metadata/${dataSource}/${limitCount}`,
                    config
                )
                .then((res) => {
                    getFilterData(res.data.data)
                });
            stopLoading()
        } else {
            startLoading()
            await axios
                .get(
                    BASE_URL + `/get_all_file_metadata/${limitCount}`,
                    config
                )
                .then((res) => {
                    getFilterData(res.data.data)
                });
            stopLoading()
        }
    };

    const handleSelectionChange = (newSelection) => {
        // `newSelection` is an array of row IDs that are currently selected
        setSelectedRowIds(newSelection);
    };

    const handleDeleteFiles = () => {
        let deleteFilesArr = [];
        let selectedDataArr = [];
        if (selectedRowIds.length !== 0) {
            startLoading();
            selectedRowIds.forEach((rowItem) => {
                data.forEach((dataItem) => {
                    if (dataItem.id === rowItem && dataItem['IS_DELETED'] === 0) {
                        selectedDataArr.push(dataItem)
                    }
                })
                deleteFilesFromS3(selectedDataArr);
                let deleteObject = {
                    "ID": rowItem,
                    "DELETED_BY": user.UserId,
                    "DELETE_TIMESTAMP": formatTimestamp(Date.now())
                }

                deleteFilesArr.push(deleteObject)
            })

            axios.post(BASE_URL + "/delete_file_and_data", {"records": deleteFilesArr}, config).then((res) => {
                fetchDataBasedOnDataSource();
                if (notifyRef.current) {
                    notifyRef.current("Files Deleted Successfully", "success");
                }
                deleteFilesArr = [];
                stopLoading();
            }).catch((error) => {
                if (error.response) {
                    console.error('Server Error:', error.response);
                    // Show an error toast notification
                    if (notifyRef.current) {
                        notifyRef.current("Error fetching files", "error");
                    }
                } else if (error.request) {
                    console.error('Network Error:', error.request);
                    // Show an error toast notification
                    if (notifyRef.current) {
                        notifyRef.current("Network Error", "error");
                    }
                } else {
                    console.error('Error:', error.message);
                    if (notifyRef.current) {
                        notifyRef.current("Error deleting files", "error");
                    }
                }
            })
        } else {
            if (notifyRef.current) {
                notifyRef.current("Please select files", "error");
            }
        }
    }

    const downloadFileFromS3 = async (path) => {
        const params = {
            Bucket: 'mz-builds-storage',
            Key: path, // Replace with the actual path to your file in S3
        };

        try {
            const signedUrl = await s3.getSignedUrlPromise('getObject', params);
            // Use the signed URL to download the file
            fetch(signedUrl)
                .then((response) => response.blob())
                .then((blob) => {
                    // Create a Blob URL for the downloaded file
                    const url = URL.createObjectURL(blob);

                    // Create an anchor element to trigger the download
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = path.split('/').pop(); // Set the filename

                    // Append the anchor to the document and trigger the download
                    document.body.appendChild(a);
                    a.click();

                    // Remove the anchor from the document
                    document.body.removeChild(a);
                });

            // You can further process or display the downloaded content as needed.
        } catch (error) {
            console.error('Error downloading file from S3:', error);
        }
    }

    const columns = [
        {
            field: "UPLOADED_FILENAME",
            headerName: "Uploaded Filename",
            width: 320,
        },
        {
            field: "UPLOADED_AT",
            headerName: "Uploaded Date",
            width: 150,
            description: "Date and Time",
            valueGetter: (params) => {
                return params.value.substring(0, 10);
            },
        },
        {
            field: "DATA_SOURCE",
            type: "text",
            headerName: "Data Type",
            width: 150,
            description: "Type of data: Inlet, Outlet, Pump",
        },
        {
            field: "DELETE_TIMESTAMP",
            headerName: "Delete Timestamp",
            width: 150,
            description: "Time of deletion of the file.",
            valueGetter: (params) => {
                return params.value.substring(0, 10);
            },

        },
        // {
        //     field: 'DELETED_BY',
        //     type: "text",
        //     headerName: 'Deleted By',
        //     width: 150,
        //     description: "Name of the person who deleted the file"
        // }
        {
            field: 'actions',
            headerName: 'Action',
            width: 250,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <div className={style.center}>
                    <div style={{marginRight: "10px"}}>
                        <ColorButton
                            id="submit-button"
                            aria-haspopup="true"
                            variant="contained"
                            size={"small"}
                            onClick={() => {
                                let dataSrc = '';
                                if (params.row['DATA_SOURCE'] === 'IN') {
                                    dataSrc = 'INLET'
                                } else if (params.row['DATA_SOURCE'] === 'OUT') {
                                    dataSrc = 'OUTLET';
                                } else if (params.row['DATA_SOURCE'] === 'PUMP') {
                                    dataSrc = 'PUMP';
                                }
                                navigate(`/file-data?fi=${params.row.id}&data_src=${dataSrc}`)
                            }}
                            color={"secondary"}
                            width={"auto"}
                        >
                            View
                        </ColorButton>
                    </div>
                    <div>
                        <ColorButton
                            id="submit-button"
                            aria-haspopup="true"
                            variant="contained"
                            size={"small"}
                            onClick={() => {
                                downloadFileFromS3(params.row['FILENAME']).then()
                            }}
                            color={"secondary"}
                            width={"auto"}
                        >
                            Download
                        </ColorButton>
                    </div>
                </div>
            ),
        },
    ];

    const handleIsDeleted = () => {
        setShowIsDelete(!showIsDelete)
    }

    return (
        <Base user={user} isLoading={isLoading} notifyRef={notifyRef}>
            <div style={{width: '100%', margin: "20px"}}>
                <div style={{marginBottom: "20px", display: "flex", alignItems: "center"}}>
                    <Stack direction="row" alignItems="left" spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <div style={{width: "130px"}}> Select Timespan:</div>
                            <Dropdown title={"Timespan"} options={timeSpanOptions} setState={setLimitCount}/>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <div style={{width: "150px"}}> Select Data Source:</div>
                            <Dropdown title={"Data Source"} options={dataSourceMetaOptions} setState={setDataSource}/>
                        </Stack>
                        {roles.delete &&
                            <Stack direction="row" alignItems="center" spacing={2}><ColorButton
                                id="delete-files-button"
                                aria-haspopup="true"
                                variant="contained"
                                size={"small"}
                                onClick={handleDeleteFiles}
                                color={"secondary"}
                                width={"auto"}
                            >
                                Delete
                            </ColorButton></Stack>}
                        <FormGroup>
                            <FormControlLabel control={<Switch onChange={handleIsDeleted}
                                                               inputProps={{'aria-label': 'controlled'}}/>}
                                              label="Show Deleted Files"/>
                        </FormGroup>
                    </Stack>
                </div>

                <div style={{marginBottom: "20px"}}>
                    <Stack direction="row" alignItems="left" spacing={2}>
                        <div> Time
                            Period: {limitCount.type !== 'click' && getPreviousDate(limitCount)} to {currentDate}</div>
                        <div> Data Source: {dataSource}</div>
                    </Stack>
                </div>
                <DataGrid
                    rows={data}
                    columns={columns}
                    autoHeight
                    slots={{noRowsOverlay: CustomNoRowsOverlay}}
                    sx={{'--DataGrid-overlayHeight': '300px'}}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 30},
                        },
                    }}
                    pageSizeOptions={[30, 60]}
                    checkboxSelection
                    onRowSelectionModelChange={handleSelectionChange}
                />
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>
        </Base>
    );
}

export default FileMetaData;
