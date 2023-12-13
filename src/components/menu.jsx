import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAuthenticated, signout } from "../auth/helper";
import { Roles, getRoles } from "../utils/constants";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import KeyIcon from "@mui/icons-material/Key";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { useState } from "react";

const Menu = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);

  const roles = getRoles(role);

  const handleClick = () => {
    setOpen(!open);
  };
  const currentTab = (navigate, path) => {
    if (location.pathname === path) {
      return { color: "#28a745" };
    } else {
      return { color: "#FFFFFF" };
    }
  };

  return (
    <>
      <ListItemButton onClick={() => navigate("/")}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>

      {roles.admin && (
        <>
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => navigate("/admin/users")}
              >
                <ListItemIcon>
                  <ManageAccountsIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Users" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => navigate("/admin/createuser")}
              >
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Add User" />
              </ListItemButton>
            </List>
          </Collapse>
        </>
      )}
      <ListItemButton
        onClick={() => {
          roles.admin
            ? navigate("/admin/changepassword")
            : navigate("/changepassword");
        }}
      >
        <ListItemIcon>
          <KeyIcon />
        </ListItemIcon>
        <ListItemText primary="Change Password" />
      </ListItemButton>

      {roles.insert && (
        <ListItemButton
          onClick={() => {
            navigate("/file-upload");
          }}
        >
          <ListItemIcon>
            <CloudUploadIcon />
          </ListItemIcon>
          <ListItemText primary="File Upload" />
        </ListItemButton>
      )}

      <ListItemButton
        onClick={() => {
          navigate("/file-meta-data");
        }}
      >
        <ListItemIcon>
          <TextSnippetIcon />
        </ListItemIcon>
        <ListItemText primary="Files" />
      </ListItemButton>

        <ListItemButton
            onClick={() => {
                navigate("/file-data");
            }}
        >
            <ListItemIcon>
                <TextSnippetIcon/>
            </ListItemIcon>
            <ListItemText primary="File Data"/>
        </ListItemButton>

      <ListItemButton
        onClick={() =>
          signout(() => {
            navigate("/");
          })
        }
      >
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="Signout" />
      </ListItemButton>
    </>
  );
};

export default Menu;
