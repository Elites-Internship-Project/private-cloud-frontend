import React, {useRef, useState} from "react";
import {FileUploader} from "react-drag-drop-files";
import AWS from "aws-sdk";
import axios from "axios";
import {
    BASE_URL,
    ColorButton,
    dataSourceOptions,
    formatTimestamp,
} from "../utils/constants";
import style from "../css/common.module.css";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Dropdown} from "../components/Dropdown";
import {getAuthenticatedData, isAuthenticated} from "../auth/helper";
import Base from "../components/base";
import {useLoading} from "../LoadingProvider";

const fileTypes = ["CSV", "XLSX"];

// TODO update these credentials
AWS.config.update({
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
});

const s3 = new AWS.S3();

const deleteFilesFromS3 = (keys) => {
    keys.forEach((item) => {
        const params = {
            Bucket: "", // Replace with your S3 bucket name
            Key: item.key,
        };
        s3.deleteObject(params)
            .promise()
            .then((r) => console.log(r));
    });
};

function FileUpload() {
    const notifyRef = useRef(null);
    const {isLoading, startLoading, stopLoading} = useLoading();
    const [files, setFiles] = useState(null);
    const [dataSource, setDataSource] = useState("");
    const authenticatedData = isAuthenticated();

    const {user, token} = getAuthenticatedData(authenticatedData);

    const handleChange = (file) => {
        let filesArr = Object.values(file);
        setFiles(filesArr);
    };

    const handleUpload = async () => {
        if (dataSource === "" || dataSource.type === "click") {
            if (notifyRef.current) {
                notifyRef.current("Data Source is required", "error");
            }
        } else {
            if (files) {
                startLoading();

                let fileMetaArr = [];
                let uploadPromises = []; // Array to store upload promises
                let s3Data = [];

                for (const file of files) {
                    let currentTimestampInSeconds = Date.now(); // Returns the current timestamp in seconds
                    let formattedTimestamp = formatTimestamp(currentTimestampInSeconds);
                    let fileNameParts = file.name.split(".");
                    let fileExtension = fileNameParts.pop();
                    let fileNameWithoutExtension = fileNameParts.join(".");
                    let newFileName = `${currentTimestampInSeconds}.${fileExtension}`;
                    let renamedFile = new File([file], newFileName, {
                        type: file.type,
                    });

                    let params = {
                        Bucket: "mz-builds-storage",
                        Key: renamedFile.name,
                        Body: renamedFile,
                    };

                    // Create a promise for each upload
                    let uploadPromise = new Promise((resolve, reject) => {
                        s3.upload(params, (err, data) => {
                            if (err) {
                                console.error("Error uploading file:", err);
                                reject(err); // Reject the promise if there's an error
                            } else {
                                s3Data.push(data);
                                const fileMeta = {
                                    FILENAME: renamedFile.name,
                                    UPLOADED_AT: formattedTimestamp,
                                    SIZE: renamedFile.size,
                                    FILE_LOCATION: data.Location,
                                    TYPE: fileExtension === 'xlsx' ? 'text/xlsx' : renamedFile.type,
                                    UPLOADED_FILENAME: file.name,
                                    DATA_SOURCE: dataSource,
                                };
                                fileMetaArr.push(fileMeta);
                                resolve(data); // Resolve the promise when the upload is successful
                            }
                        });
                    });

                    uploadPromises.push(uploadPromise);
                }

                // Wait for all upload promises to resolve
                Promise.all(uploadPromises)
                    .then(() => {
                        const config = {
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        };
                        const body = {
                            FILE_META_ARRAY: fileMetaArr, SOURCE_FLAG: 0
                        }

                        axios
                            .post(
                                BASE_URL + "/insert_filemeta_list",
                                body,
                                config
                            )
                            .then((res) => {
                                setFiles(null);
                                stopLoading();
                                let fileUploadedStatus = Object.keys(res.data['file_status'])
                                let successCount = 0
                                let failCount = 0
                                for (let i in res.data['file_status']) {
                                    if (res.data['file_status'][i] === 'success') {
                                        successCount++
                                    } else {
                                        failCount++
                                    }
                                }
                                console.log("res :: => :: ", res)
                                if (failCount === 0) {
                                    if (notifyRef.current) {
                                        notifyRef.current("All Files Uploaded Successfully", "success");
                                    }
                                } else {
                                    if (notifyRef.current) {
                                        notifyRef.current(`${successCount}/${fileUploadedStatus.length} Files Uploaded Successfully`, "error");
                                    }
                                }
                            })
                            .catch((error) => {
                                if (error.response) {
                                    console.error("Server Error:", error.response);
                                    // Show an error toast notification
                                    stopLoading();
                                    if (notifyRef.current) {
                                        notifyRef.current("Error uploading files", "error");
                                    }
                                } else if (error.request) {
                                    console.error("Network Error:", error.request);
                                    // Show an error toast notification
                                    stopLoading();
                                    if (notifyRef.current) {
                                        notifyRef.current("Network Error", "error");
                                    }
                                } else {
                                    console.error("Error:", error.message);
                                    stopLoading();
                                    if (notifyRef.current) {
                                        notifyRef.current("Error uploading files", "error");
                                    }
                                }
                                deleteFilesFromS3(s3Data);
                            });
                    })
                    .catch((error) => {
                        console.error("Error uploading files:", error);
                        // Show an error toast notification
                        stopLoading();
                        if (notifyRef.current) {
                            notifyRef.current("Error uploading files", "error");
                        }
                    });
            } else {
                if (notifyRef.current) {
                    notifyRef.current("Please Add Files", "error");
                }
            }

        }
    };

    return (
        <Base user={user} isLoading={isLoading} notifyRef={notifyRef}>
            <div className={style.centeredDiv}>
                <div className={style.dropDown}>
                    <div>
                        Select Data Source <span style={{color: "red"}}>*</span>
                    </div>
                    <Dropdown
                        title={"Data Source"}
                        options={dataSourceOptions}
                        setState={setDataSource}
                        state={dataSource}
                    />
                </div>

                <FileUploader
                    handleChange={handleChange}
                    name="file"
                    types={fileTypes}
                    multiple={true}
                    children={
                        <div className={style.fileDropArea}>
                            <p>Click to Add Files</p>
                            <p>or</p>
                            <p>Drop Files Here</p>
                        </div>
                    }
                />

                <p>
                    {files
                        ? `File name: ${
                            files.length > 1
                                ? files.map((file) => " " + file.name)
                                : files[0].name
                        }`
                        : "no files added yet"}
                </p>
                <ColorButton
                    id="download-csv-button"
                    aria-haspopup="true"
                    variant="contained"
                    size={"small"}
                    onClick={handleUpload}
                    color={"secondary"}
                    width={"auto"}
                >
                    UPLOAD FILE
                </ColorButton>

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

export default FileUpload;
