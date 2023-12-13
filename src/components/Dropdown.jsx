import React, {useState} from "react";
import {Button, Menu, MenuItem} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {styled, alpha} from '@mui/material/styles';
import {blueGrey} from "@mui/material/colors";
import {timeSpanOptions} from "../utils/constants";


const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        {...props}
    />
))(({theme}) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        backgroundColor: "#fff",
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.success.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

const ColorButton = styled(Button)(({theme}) => ({
    color: theme.palette.getContrastText(blueGrey[700]),
    backgroundColor: blueGrey[700],
    '&:hover': {
        backgroundColor: blueGrey[900],
    },
    textTransform: 'none',
    width: "130px"
}));

export const Dropdown = (params) => {
    const {title, options, setState, state, setFilters} = params;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [stateTitle, setStateTitle] = useState(title);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleChange = (item) => {
        setAnchorEl(null);
        if (item === 'IN') {
            setStateTitle('Inlet')
            setState(item);
        } else if (item === 'OUT') {
            setStateTitle('Outlet')
            setState(item);
        } else if (item === 'PUMP') {
            setStateTitle('Pump')
            if (setFilters)
                setFilters({})
            setState(item);
        } else if (item === 'ALL') {
            setStateTitle('All')
            setState(item);
        } else if (item === 'INLET') {
            setStateTitle('Inlet')
            setFilters({})
            setState(item);
        } else if (item === 'OUTLET') {
            setStateTitle('Outlet')
            setFilters({})
            setState(item);
        } else if (timeSpanOptions.includes(item)) {
            if (item === 'Life Time') {
                setState("10000")
            } else {
                setState(item)
            }
        }
    };

    return (
        <div>
            <ColorButton
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                size={"small"}
                onClick={handleClick}
                color={"secondary"}
                endIcon={<KeyboardArrowDownIcon/>}
            >
                {state === "" ? title : stateTitle}
            </ColorButton>

            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleChange}
            >
                {options.map((item, index) => {
                    let itemTitle = null;
                    if (item === "IN") {
                        itemTitle = "Inlet"
                    } else if (item === "OUT") {
                        itemTitle = "Outlet"
                    } else if (item === "ALL") {
                        itemTitle = "All"
                    } else if (item === 'PUMP') {
                        itemTitle = "Pump"
                    } else if (item === 'INLET') {
                        itemTitle = "Inlet"
                    } else if (item === 'OUTLET') {
                        itemTitle = "Outlet"
                    } else if (timeSpanOptions.includes(item)) {
                        if (item === 'Life Time') {
                            itemTitle = item
                        } else {
                            itemTitle = item + ' days'
                        }
                    }
                    return (
                        <MenuItem key={index} onClick={() => handleChange(item)} disableRipple>
                            {itemTitle != null ? itemTitle : item}
                        </MenuItem>
                    )
                })}
            </StyledMenu>
        </div>
    )
}