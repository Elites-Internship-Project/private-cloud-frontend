import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { getAuthenticatedData, isAuthenticated } from "../auth/helper";
import {
  activateUser,
  deactivateUser,
  getAllUsers,
} from "../services/adminService";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import ArchiveIcon from "@mui/icons-material/Archive";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import { Link } from "react-router-dom";
import Base from "../components/base";
import {
  createTheme,
  ThemeProvider,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { Roles, getStringRoles } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../LoadingProvider";
import Alert from "../components/Alert";
const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#fff",
    },
    text: {
      primary: "#000",
    },
  },
});

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

function ManageUsers() {
  const notifyRef = useRef(null);
  const authenticatedData = isAuthenticated();
  const { token, user } = getAuthenticatedData(authenticatedData);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [anchorEl, setAnchorEl] = useState(Array(users.length).fill(null));
  const [open, setOpen] = useState(Array(users.length).fill(false));

  const handleClick = (event, index) => {
    const newAnchorEl = [...anchorEl];
    newAnchorEl[index] = event.currentTarget;
    setAnchorEl(newAnchorEl);

    const newOpen = [...open];
    newOpen[index] = true;
    setOpen(newOpen);
  };

  const handleClose = (index) => {
    const newAnchorEl = [...anchorEl];
    newAnchorEl[index] = null;
    setAnchorEl(newAnchorEl);

    const newOpen = [...open];
    newOpen[index] = false;
    setOpen(newOpen);
  };

  const deactivateThisUser = (email) => {
    startLoading();
    let confirmed = window.confirm("Are you sure");
    if (confirmed == true) {
      deactivateUser(token, { email }).then((data) => {
        if (data.error) {
          stopLoading();
          if (notifyRef.current) {
            notifyRef.current("User not deactivated", "error");
          }
        } else {
          preloadData();
          stopLoading();

          if (notifyRef.current) {
            notifyRef.current("User Deactivated", "success");
          }
        }
      });
    }
  };

  const activateThisUser = (email) => {
    let confirmed = window.confirm("Are you sure");
    if (confirmed == true) {
      startLoading();
      activateUser(token, { email }).then((data) => {
        if (data.error) {
          stopLoading();
          if (notifyRef.current) {
            notifyRef.current("User not activated", "error");
          }
        } else {
          preloadData();
          stopLoading();

          if (notifyRef.current) {
            notifyRef.current("User activated", "success");
          }
        }
      });
    }
  };

  const preloadData = async () => {
    startLoading();
    await getAllUsers(token).then((data) => {
      console.log(data.data);
      let res = data.data;
      if (!res.status) {
        setError(res.message);
        if (notifyRef.current) {
          notifyRef.current("Error fetching users", "error");
        }
        stopLoading();
      } else {
        setUsers(res.data);
        stopLoading();
      }
    });
  };

  useEffect(() => {
    preloadData();
  }, []);

  return (
    <Base user={user} isLoading={isLoading} notifyRef={notifyRef}>
      <ThemeProvider theme={theme}>
        {error ? (
          <Paper>
            <Typography
              variant="h5"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {error}
            </Typography>
          </Paper>
        ) : (
          <Paper>
            <Typography
              variant="h5"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              All Users ({users && users.length})
              <Button
                variant="contained"
                onClick={() => navigate("/admin/createuser")}
              >
                <PersonAddIcon fontSize={"small"} sx={{ marginRight: "5px" }} />
                Add User
              </Button>
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Permissions</TableCell>
                  <TableCell>IsActive</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users &&
                  users.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.Name}</TableCell>
                      <TableCell>{user.Email}</TableCell>
                      <TableCell>{getStringRoles(user.Role)}</TableCell>

                      <TableCell>
                        {user.IsActive == 1 ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <CancelIcon color="error" />
                        )}
                      </TableCell>

                      <TableCell>
                        <IconButton
                          aria-label="more"
                          id={`long-button-${index}`} // Use a unique ID for each user
                          aria-controls={
                            open ? `long-menu-${index}` : undefined
                          }
                          aria-expanded={open ? "true" : undefined}
                          aria-haspopup="true"
                          onClick={(event) => handleClick(event, index)} // Pass the index
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <StyledMenu
                          id={`demo-customized-menu-${index}`} // Use a unique ID for each user
                          MenuListProps={{
                            "aria-labelledby": `demo-customized-button-${index}`, // Use a unique ID
                          }}
                          anchorEl={anchorEl[index]} // Use a unique anchor element
                          open={open[index]} // Use a unique state variable
                          onClose={() => handleClose(index)} // Pass the index
                        >
                          <MenuItem
                            onClick={() => {
                              navigate("/admin/user/update/" + user.UserId);
                              handleClose(index);
                            }}
                            disableRipple
                          >
                            <EditIcon />
                            Edit
                          </MenuItem>
                          {user.Role != Roles.ADMIN &&
                            (user.IsActive ? (
                              <MenuItem
                                onClick={() => {
                                  deactivateThisUser(user.Email);
                                  handleClose(index);
                                }}
                                disableRipple
                                sx={{ color: "#d32f2f !important" }}
                              >
                                <CancelIcon
                                  sx={{ color: "#d32f2f !important" }}
                                />
                                Deactivate
                              </MenuItem>
                            ) : (
                              <MenuItem
                                onClick={() => {
                                  activateThisUser(user.Email);
                                  handleClose(index);
                                }}
                                disableRipple
                                sx={{ color: "#4CAF50 !important" }}
                              >
                                <CheckCircleIcon
                                  sx={{ color: "#4CAF50 !important" }}
                                />
                                Activate
                              </MenuItem>
                            ))}
                        </StyledMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </ThemeProvider>
    </Base>
  );
}

export default ManageUsers;
