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
import {inletOutletColumns, pumpColumns, retrieveColumns} from "../utils/constants";

const FilterPopup = ({open, onClose, dataSource, setFilters}) => {
    const [columns, setColumns] = useState(inletOutletColumns);
    const [error, setError] = useState(false);

    const handleColumns = () => {
        retrieveColumns(dataSource, true).then((res) => {
            setColumns(res);
        })
    }

    useEffect(() => {
        handleColumns()
    }, [dataSource])


    const [filterValues, setFilterValues] = useState(
        columns.reduce((acc, column) => {
            acc[column.field] = {min: '', max: ''};
            return acc;
        }, {})
    );

    const handleInputChange = (field, type) => (event) => {
        const newValue = event.target.value;
        setFilterValues({
            ...filterValues,
            [field]: {
                ...filterValues[field],
                [type]: newValue,
            },
        });
    };


    const handleDateChange = (field, type) => (date) => {
        setFilterValues({
            ...filterValues,
            [field]: {
                ...filterValues[field],
                [type]: date ? date.toISOString().split('T')[0] : '', // Format date as 'YYYY-MM-DD'
            },
        });
    };

    const handleClose = () => {
        onClose();
    };

    const handleReset = () => {
        setFilters({});
        setFilterValues(columns.reduce((acc, column) => {
            acc[column.field] = {min: '', max: ''};
            return acc;
        }, {}))
        setError(false)
    }

    const handleApply = () => {
        // Handle the logic when the Apply button is clicked
        // Convert values to the desired format
        const formattedFilters = {};
        Object.keys(filterValues).forEach((field) => {
            const {min, max} = filterValues[field];
            if (min !== '' || max !== '') {
                formattedFilters[field] = {
                    min: min,
                    max: max
                }
            }
        });

        // If RECORD_DATE is present, convert it to a string
        if ('RECORD_DATE' in formattedFilters) {
            formattedFilters['RECORD_DATE'] = {
                min: formattedFilters['RECORD_DATE'].min,
                max: formattedFilters['RECORD_DATE'].max,
            };
        }

        Object.keys(formattedFilters).forEach((field) => {
            const {min, max} = formattedFilters[field];
            if (min !== '' && max !== '') {
                setFilters(formattedFilters);
                setError(false)
                onClose();
            } else {
                setError(true)
            }
        })
    };

    return (
        <>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Filter Ranges</DialogTitle>
                <DialogContent>
                    {error && <div className={style.error}>Enter Corresponding Min and Max Values</div>}
                    {columns && columns.map((column, index) => (
                        <div key={index}>
                            {column.field === 'RECORD_DATE' ? (
                                <div className={style.datePicker}>
                                    <DatePicker
                                        placeholderText={`Start Date`}
                                        selected={filterValues[column.field]?.min ? new Date(filterValues[column.field].min) : null}
                                        onChange={handleDateChange(column.field, 'min')}
                                        dateFormat="yyyy-MM-dd"
                                        className={`form-control`}
                                    />
                                    <DatePicker
                                        placeholderText={`End Date`}
                                        selected={filterValues[column.field]?.max ? new Date(filterValues[column.field].max) : null}
                                        onChange={handleDateChange(column.field, 'max')}
                                        dateFormat="yyyy-MM-dd"
                                        className={`form-control`}
                                    />
                                </div>
                            ) : (
                                <Grid container spacing={2} key={column.field}>
                                    <Grid item xs={6}>
                                        <TextField
                                            label={`Min ${column.headerName}`}
                                            type="text"
                                            // inputProps={{step: '0.01'}}
                                            value={filterValues[column.field]?.min}
                                            onChange={handleInputChange(column.field, 'min')}
                                            fullWidth
                                            margin="normal"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label={`Max ${column.headerName}`}
                                            type="text"
                                            // inputProps={{step: '0.01'}}
                                            value={filterValues[column.field]?.max}
                                            onChange={handleInputChange(column.field, 'max')}
                                            fullWidth
                                            margin="normal"
                                        />
                                    </Grid>
                                </Grid>
                            )}
                        </div>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleReset}>Reset</Button>
                    <Button onClick={handleApply}>Apply</Button>
                </DialogActions>
            </Dialog>

        </>
    );
};

export default FilterPopup;
