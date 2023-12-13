import React, {useEffect, useRef, useState} from "react";
import Base from "../components/base";
import {useLoading} from "../LoadingProvider";
import {getAuthenticatedData, isAuthenticated} from "../auth/helper";
import axios from "axios";
import {
    BASE_URL,
    ColorButton,
    dataSourceOptionsData,
    getRoles,
    retrieveColumns,
} from "../utils/constants";
import {Stack, TextField} from "@mui/material";
import {Dropdown} from "../components/Dropdown";
import CustomNoRowsOverlay from "../components/CustomNoRowsOverlay";
import {DataGrid} from "@mui/x-data-grid";
import "../css/common.module.css";
import PaginationFooter from "../components/PaginationFooter";
import FilterPopUp from "../components/FilterPopUp";
import {useSearchParams} from "react-router-dom";
import ExportBtn from "../components/ExportBtn";
import EditPopup from "../components/EditPopUp";

const FileData = () => {
    const authenticatedData = isAuthenticated();
    const notifyRef = useRef(null);
    const {isLoading, startLoading, stopLoading} = useLoading();
    const {user, token} = getAuthenticatedData(authenticatedData);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataSource, setDataSource] = useState("INLET");
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [filters, setFilters] = useState({});
    const [totalCount, setTotalCount] = useState(0);
    const [searchParams] = useSearchParams();
    const [downloadData, setDownloadData] = useState([]);
    const isParams = searchParams.has("fi");
    const [customHeaders, setCustomHeaders] = useState([]);
    const [editPopUp, setEditPopUp] = useState(false);
    const [rowsPerPage, setRowPerPage] = useState(50);
    const [headers, setHeaders] = useState([]);
    const roles = getRoles(user.Role);
    const dataSrc = searchParams.get("data_src");

    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    const handleOpenEditPopup = () => {
        setEditPopUp(true);
    };

    const handleCloseEditPopup = () => {
        setEditPopUp(false);
    };
    const handleOpenPopup = () => {
        setPopupOpen(true);
    };

    const handleClosePopup = () => {
        setPopupOpen(false);
    };

    console.log("Headers :: => ::", headers)
    const handleColumns = () => {
        if (isParams) {
            retrieveColumns(searchParams.get("data_src"), false).then((res) => {
                res.forEach((item) => {
                    item["valueFormatter"] = (params) => {
                        if (params.value !== "undefined") {
                            return params.value.toString();
                        } else return params.value;
                    };
                });
                setHeaders(res);
            });
        } else {
            retrieveColumns(dataSource, false).then((res) => {
                res.forEach((item) => {
                    item["valueFormatter"] = (params) => {
                        if (params.value !== "undefined") {
                            return params.value.toString();
                        } else return params.value;
                    };
                });
                setHeaders(res);
            });
        }
    };
    useEffect(() => {
        setFilters({})
    }, [dataSource])

    useEffect(() => {
        handleColumns();
    }, [dataSource, dataSrc]);

    useEffect(() => {
        fetchData(0);
    }, [dataSource, currentPage, filters, editPopUp]);

    useEffect(() => {
        const a = setTimeout(() => {
            fetchData(0);
        }, 1000);

        return () => clearTimeout(a);
    }, [rowsPerPage]);

    const getFilterDownloadData = (data) => {
        const keys = ["FILENAME", "ID", "id", "RECORD_DATE"];
        return data.map((item) => {
            const object = {...item};
            keys.forEach((key) => delete object[key]);
            return object;
        });
    };

    const handleExportData = () => {
        startLoading();
        const temp = filters;

        if (isParams) {
            temp["FILENAME"] = {
                min: parseInt(searchParams.get("fi")),
                max: parseInt(searchParams.get("fi")),
            };
        }

        const body = {
            data_source: isParams ? searchParams.get("data_src") : dataSource,
            filters: temp,
        };

        axios.post(BASE_URL + "/get_kind_data_export", body, config).then((res) => {
            res.data.data.forEach((item) => {
                item.id = item["ID"];
            });
            let finalData = getFilterDownloadData(res.data.data);
            let keysArray = Object.keys(finalData[0]);
            setCustomHeaders(keysArray);
            setDownloadData(finalData);
            stopLoading();
        });
    };
    const fetchData = (isPageChange) => {
        startLoading();
        setDownloadData([]);
        const temp = filters;

        if (isParams) {
            temp["FILENAME"] = {
                min: parseInt(searchParams.get("fi")),
                max: parseInt(searchParams.get("fi")),
            };
        }
        const body = {
            data_source: isParams ? searchParams.get("data_src") : dataSource,
            offset: currentPage - 1,
            limit: rowsPerPage === "" ? 0 : rowsPerPage,
            filters: temp,
        };

        axios.post(BASE_URL + "/get_kind_data", body, config).then((res) => {
            res.data.data.forEach((item) => {
                item.id = item["ID"];
            });
            setData(res.data.data);
            //   if (!isPageChange) {
            //     setCurrentPage(1);
            //   }

            setTotalCount(res.data.total_count);
            stopLoading();
        });
    };

    return (
        <Base user={user} isLoading={isLoading} notifyRef={notifyRef}>
            <div style={{width: "100%", margin: "20px"}}>
                <div
                    style={{
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Stack direction="row" alignItems="left" spacing={2}>
                        {!isParams && (
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <div style={{width: "150px"}}> Select Data Source:</div>
                                <Dropdown
                                    title={dataSource}
                                    options={dataSourceOptionsData}
                                    setState={setDataSource}
                                    state={dataSource}
                                    setFilters={setFilters}
                                />
                            </Stack>
                        )}
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <ColorButton
                                id="download-csv-button"
                                aria-haspopup="true"
                                variant="contained"
                                size={"small"}
                                onClick={handleOpenPopup}
                                color={"secondary"}
                                width={"auto"}
                            >
                                Filters
                            </ColorButton>

                            {roles.update && (
                                <ColorButton
                                    id="edit-button"
                                    aria-haspopup="true"
                                    variant="contained"
                                    size={"small"}
                                    onClick={handleOpenEditPopup}
                                    color={"secondary"}
                                    width={"auto"}
                                >
                                    Edit
                                </ColorButton>
                            )}
                            {downloadData.length === 0 && (
                                <ColorButton
                                    id="submit-button"
                                    aria-haspopup="true"
                                    variant="contained"
                                    size={"small"}
                                    onClick={handleExportData}
                                    color={"secondary"}
                                    width={"auto"}
                                >
                                    Export
                                </ColorButton>
                            )}
                            {downloadData.length !== 0 && (
                                <ExportBtn
                                    data={downloadData}
                                    customHeaders={customHeaders}
                                />
                            )}
                            <TextField
                                label={"Rows Per Page"}
                                value={rowsPerPage}
                                onChange={(e) => {
                                    const newValue = parseFloat(e.target.value);
                                    // Allow backspace to clear the value
                                    const clampedValue =
                                        e.target.value === ""
                                            ? ""
                                            : Math.min(100, Math.max(0, newValue));
                                    setRowPerPage(clampedValue);
                                }}
                                size="small"
                                type="number"
                                margin="normal"
                            />
                        </Stack>
                    </Stack>
                </div>
                {dataSource !== "PUMP" ? (
                    <FilterPopUp
                        open={isPopupOpen}
                        onClose={handleClosePopup}
                        dataSource={isParams ? dataSrc : dataSource}
                        setFilters={setFilters}
                    />
                ) : (
                    <FilterPopUp
                        open={isPopupOpen}
                        onClose={handleClosePopup}
                        dataSource={isParams ? dataSrc : dataSource}
                        setFilters={setFilters}
                    />
                )}
                {roles.update && (
                    <EditPopup
                        open={editPopUp}
                        onClose={handleCloseEditPopup}
                        filters={filters}
                    />
                )}

                {!isLoading && (
                    <>
                        <DataGrid
                            rows={data}
                            columns={headers}
                            autoHeight
                            slots={{noRowsOverlay: CustomNoRowsOverlay}}
                            sx={{
                                "--DataGrid-overlayHeight": "300px",
                                "& .MuiDataGrid-footerContainer": {
                                    display: "none",
                                },
                            }}
                        />
                        <Stack direction="row" alignItems="left" spacing={2}>
                            <PaginationFooter
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalCount={totalCount}
                                perPage={rowsPerPage}
                            />
                            <div>
                                <TextField
                                    label={"Rows Per Page"}
                                    value={rowsPerPage}
                                    onChange={(e) => {
                                        const newValue = parseFloat(e.target.value);

                                        // Allow backspace to clear the value
                                        const clampedValue =
                                            e.target.value === ""
                                                ? ""
                                                : Math.min(100, Math.max(0, newValue));

                                        setRowPerPage(clampedValue);
                                    }}
                                    size="small"
                                    type="number"
                                    margin="normal"
                                />
                            </div>
                        </Stack>
                    </>
                )}
            </div>
        </Base>
    );
};

export default FileData;
